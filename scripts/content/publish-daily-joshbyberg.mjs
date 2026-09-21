#!/usr/bin/env node
// Daily publish job for joshbyberg.com ONLY.
//
// Promotes the single oldest draft in drafts/joshbyberg/ into
// src/content/joshbyberg/, commits, and pushes to main. That push is what
// "publishes" it — the joshbyberg collection has no date-gate, so anything
// committed to src/content/joshbyberg is live the moment Vercel finishes the
// next build. Running this script more than once in a day therefore
// publishes more than one post that day; it is meant to be invoked by cron
// exactly once daily.
//
// Modeled tightly on the sibling script scripts/content/publish-daily-
// whitespace.mjs, including its four hardening fixes (H1-H4 below) and its
// safety properties: fail-closed on a malformed draft, spawnSync with argv
// arrays (never a shell string), a check that HEAD is ahead of origin/main
// before publishing (prevents a duplicate publish after a failed push), and
// an assertion that the current branch is the real publish branch before any
// git action. See that file's own header comment for the H1-H4 defects that
// were found and fixed in it earlier today (2026-09-21) — this script is
// written with those fixes already in place rather than repeating the bugs.
//
// New for joshbyberg.com, on top of the site-publish step: a best-effort,
// EXPLICITLY NON-FATAL Facebook cross-post to the "JB Web Design" Page
// (Page ID 1291628557362420). As of 2026-09-21 that Page's Graph API
// credentials are confirmed broken — it was never added to the Facebook App
// in Meta Business Settings, which only Josh can fix by hand — so this step
// is expected to fail today. It must fail LOUDLY (a clear, named log line)
// and NEVER block or fail the site publish. See postToFacebook() below.
//
// Draft format note (verified 2026-09-21 by reading the actual queue, not
// assumed from whitespace's format): joshbyberg drafts originally used
// "## 1. Post Metadata & Strategy" with only Target Audience/Goal/Required
// Action bullets — no Title/Excerpt/Tags/Type fields the way whitespace's
// drafts have them. The four real drafts in the queue at the time this
// script was written were patched (see commit adding Title/Excerpt/Tags/Type
// bullets to drafts/joshbyberg/*.md) to carry that same metadata contract
// so this script's fail-closed metadata check has something real to check.
// A future joshbyberg draft that omits these fields will be refused by this
// script exactly like a malformed whitespace draft is refused — the fix is
// to add the metadata to the draft, not to weaken this script.
//
// Usage:
//   node scripts/content/publish-daily-joshbyberg.mjs           # publish + commit + push
//   node scripts/content/publish-daily-joshbyberg.mjs --dry-run # scaffold + build only, no git, no Facebook

import fs from 'fs';
import os from 'os';
import path from 'path';
import { spawnSync } from 'child_process';
import { fileURLToPath } from 'url';
import { slugify, getCollection } from './schema.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const REPO_ROOT = path.resolve(__dirname, '../../');
const DRY_RUN = process.argv.includes('--dry-run');
const PUBLISH_POST = path.join(__dirname, 'publish-post.mjs');
const PUBLISH_BRANCH = 'main';
const COLLECTION = 'joshbyberg';
const DRAFTS_DIR = path.join(REPO_ROOT, 'drafts', COLLECTION);
const SITE_ORIGIN = 'https://joshbyberg.com';

// Facebook Page for joshbyberg.com is "JB Web Design". Confirmed broken
// today (2026-09-21): graph.facebook.com calls with both the bare page
// token/id and the long-lived user token used to mint page tokens returned
// "(#200) Provide valid app ID" / "An active access token must be used" —
// this Page was never added to the Facebook App. Env var names follow the
// same PREFIX_PAGE_ID / PREFIX_PAGE_ACCESS_TOKEN convention already used for
// WS_ (Whitespace) and BBR_ (Big Berg Racing) in /home/josh/automation/data/.env.
// JB_PAGE_ID falls back to the known Page ID so this step still attempts a
// real call (and logs a real failure) even before that env var is added.
const FB_PAGE_ID = process.env.JB_PAGE_ID || '1291628557362420';
const FB_PAGE_TOKEN = process.env.JB_PAGE_ACCESS_TOKEN || '';
const FB_API_VERSION = 'v21.0';
const CURL_MAX_TIME_S = 30;

// Run a git (or other) command with an argv array — never a shell string.
// Throws on a non-zero exit or a spawn error, carrying stdout/stderr.
function runGit(args, options = {}) {
  const result = spawnSync('git', args, {
    cwd: REPO_ROOT,
    encoding: 'utf8',
    shell: false,
    ...options,
  });
  if (result.error) {
    throw new Error(`git ${args.join(' ')} failed to run: ${result.error.message}`);
  }
  if (result.status !== 0) {
    const output = `${result.stdout ?? ''}${result.stderr ?? ''}`.trim();
    throw new Error(`git ${args.join(' ')} exited ${result.status}${output ? `: ${output}` : ''}`);
  }
  return result.stdout ?? '';
}

function getFirstDraft() {
  if (!fs.existsSync(DRAFTS_DIR)) return null;

  // Sort explicitly — see publish-daily-whitespace.mjs's identical comment:
  // fs.readdirSync's order is filesystem-native and is not guaranteed to
  // match between the Windows box this is authored on and the Linux box
  // (grandpa-desktop) this runs on unattended.
  const files = fs
    .readdirSync(DRAFTS_DIR)
    .filter((f) => f.endsWith('.md'))
    .sort();
  if (files.length === 0) return null;

  return files[0];
}

// Extract the Option A body. Requires BOTH "### Option A:" and a following
// "### Option B:" to be present — same H1 fix as publish-daily-whitespace.mjs.
// Without a terminating Option B, "rest of the file" would ship the Image
// Ideas / Facebook Cross-Post Ideas sections straight to production.
function extractOptionABody(content, filename) {
  const OPTION_A = '### Option A:';
  const OPTION_B = '### Option B:';

  const aIndex = content.indexOf(OPTION_A);
  if (aIndex === -1) {
    console.error(`No "${OPTION_A}" found in ${filename}. Refusing to publish.`);
    return null;
  }

  const bIndex = content.indexOf(OPTION_B, aIndex + OPTION_A.length);
  if (bIndex === -1) {
    console.error(
      `Refusing to publish ${filename}: found "${OPTION_A}" but no "${OPTION_B}" ` +
        `after it. Without a terminating Option B section, the post body would be ` +
        `everything else in the file — including any internal notes, hashtags or ` +
        `cross-post copy below Option A. Add an "${OPTION_B}" section to this draft, ` +
        `or pull it from drafts/joshbyberg/ if it isn't ready.`
    );
    return null;
  }

  let body = content.slice(aIndex + OPTION_A.length, bIndex).trim();
  body = body.replace(/^\*\[.*\]\*\n*/, '');
  return body;
}

function processJoshbyberDraft(filename) {
  const filePath = path.join(DRAFTS_DIR, filename);
  const content = fs.readFileSync(filePath, 'utf8');

  const titleMatch = content.match(/- \*\*Title:\*\* (.*)/);
  const excerptMatch = content.match(/- \*\*Excerpt:\*\* (.*)/);
  const tagsMatch = content.match(/- \*\*Tags:\*\* (.*)/);
  const typeMatch = content.match(/- \*\*Type:\*\* (.*)/);

  if (!titleMatch || !excerptMatch || !tagsMatch) {
    console.error(
      `Missing metadata in ${filename} — need "- **Title:**", "- **Excerpt:**" and ` +
        `"- **Tags:**" bullets under "## 1. Post Metadata & Strategy". Refusing to publish.`
    );
    process.exitCode = 1;
    return false;
  }

  const title = titleMatch[1].trim();
  const excerpt = excerptMatch[1].trim();
  const tags = tagsMatch[1].trim();
  const type = typeMatch ? typeMatch[1].trim() : 'post';

  const body = extractOptionABody(content, filename);
  if (body === null) {
    process.exitCode = 1;
    return false;
  }

  // Written outside the repo (os.tmpdir()) rather than into drafts/joshbyberg/
  // itself — a hard kill can't leave a stray .md file in the directory this
  // script scans for the next draft to publish.
  const tempBodyPath = path.join(os.tmpdir(), `joshbyberg-daily-body-${process.pid}-${Date.now()}.md`);
  fs.writeFileSync(tempBodyPath, body);

  console.log(`Publishing Josh Byberg guide: ${title}`);

  // spawnSync with an argv array, shell: false — title/excerpt/tags/type
  // never pass through any shell, so no character in a draft file can break
  // out of a command. Calling publish-post.mjs directly (not `npm run`)
  // drops the only other place a shell would get involved.
  const args = [
    PUBLISH_POST,
    COLLECTION,
    '--type', type,
    '--title', title,
    '--excerpt', excerpt,
    '--tags', tags,
    '--body-file', tempBodyPath,
  ];
  if (DRY_RUN) args.push('--no-build');

  let slug = null;
  try {
    const result = spawnSync(process.execPath, args, {
      cwd: REPO_ROOT,
      stdio: 'inherit',
      shell: false,
    });
    if (result.error) {
      throw result.error;
    }
    if (result.status !== 0) {
      console.error(`Failed to publish ${filename}: publish-post.mjs exited with code ${result.status}`);
      process.exitCode = 1;
      return false;
    }
    if (!DRY_RUN) fs.unlinkSync(filePath); // Delete draft after successful publish
    slug = slugify(title);
    return { title, excerpt, slug };
  } catch (e) {
    console.error(`Failed to publish ${filename}`, e.message);
    process.exitCode = 1;
    return false;
  } finally {
    if (fs.existsSync(tempBodyPath)) fs.unlinkSync(tempBodyPath);
  }
}

// --- Facebook cross-post step. Best-effort, explicitly non-fatal. ---
// Reference pattern: /home/josh/automation/daily_ai_blog_publish_linux.py
// (force-scrape og:image, POST message+link to /{page_id}/feed, verify the
// attachment populated). This step never throws past its own boundary —
// postToFacebook() always returns and run() never lets its result affect
// the process exit code.
function curlJson(args) {
  const result = spawnSync('curl', ['-s', '--max-time', String(CURL_MAX_TIME_S), '-w', '\n%{http_code}', ...args], {
    encoding: 'utf8',
    shell: false,
  });
  if (result.error) {
    throw new Error(`curl failed to run: ${result.error.message}`);
  }
  const out = result.stdout ?? '';
  const idx = out.lastIndexOf('\n');
  const body = idx === -1 ? out : out.slice(0, idx);
  const statusStr = idx === -1 ? '' : out.slice(idx + 1).trim();
  const status = Number(statusStr) || 0;
  let parsed;
  try {
    parsed = JSON.parse(body);
  } catch {
    throw new Error(`curl response was not JSON (status ${status}): ${body.slice(0, 300)}`);
  }
  if (status < 200 || status >= 300) {
    const msg = parsed?.error?.message || JSON.stringify(parsed);
    throw new Error(`Graph API returned HTTP ${status}: ${msg}`);
  }
  return parsed;
}

function postToFacebook(post) {
  console.log('--- Facebook cross-post (JB Web Design Page) ---');

  if (!FB_PAGE_TOKEN) {
    console.error(
      'FACEBOOK CROSS-POST SKIPPED (non-fatal): JB_PAGE_ACCESS_TOKEN is not set in the ' +
        'environment. This Page\'s Graph API credentials were confirmed broken 2026-09-21 ' +
        '("(#200) Provide valid app ID" on both the bare page token and the long-lived user ' +
        'token used to mint it) — the Page was never added to the Facebook App in Meta ' +
        'Business Settings. Only Josh can fix that by hand. Site publish is NOT affected.'
    );
    return;
  }

  const url = getCollection(COLLECTION).url(post.slug);

  // M2 fix (2026-09-21 Opus review): the access_token used to sit in this
  // call's URL query string, which is visible in `ps` output and
  // /proc/<pid>/cmdline for the lifetime of the curl process on the
  // unattended Linux host. Sent as --data-urlencode instead, matching the
  // post-creation call below, which already did this correctly.
  try {
    const scrape = curlJson([
      `https://graph.facebook.com/${FB_API_VERSION}/`,
      '-X', 'POST',
      '--data-urlencode', `id=${url}`,
      '--data-urlencode', 'scrape=true',
      '--data-urlencode', `access_token=${FB_PAGE_TOKEN}`,
    ]);
    const images = scrape.image || [];
    if (!images.length) {
      console.error(
        `FACEBOOK CROSS-POST FAILED (non-fatal): og:image scrape for ${url} returned no image. ` +
          `Raw response: ${JSON.stringify(scrape)}. Site publish is NOT affected.`
      );
      return;
    }
    // F1 fix (2026-09-21 Opus review): the earlier comment here claimed a
    // mismatch would "fail loudly" via this step, but nothing actually
    // compared the scraped title to the post's own title — only presence
    // of SOME image was checked. Compare for real. A soft warning rather
    // than a hard return: og:title formatting (site suffix, truncation)
    // can legitimately differ from the raw post title, so this is a signal
    // to check by hand, not proof the wrong URL was scraped.
    if (scrape.title && !scrape.title.includes(post.title)) {
      console.error(
        `FACEBOOK CROSS-POST WARNING (non-fatal, continuing): scraped og:title ` +
          `(${JSON.stringify(scrape.title)}) does not contain the post title ` +
          `(${JSON.stringify(post.title)}) for ${url}. This may mean the wrong page was ` +
          `scraped — check the link card by hand after this run.`
      );
    }
    console.log(`Facebook scrape confirmed og:image for ${post.slug} (og:title: ${scrape.title ?? '(none)'}).`);
  } catch (e) {
    console.error(
      `FACEBOOK CROSS-POST FAILED (non-fatal): og:image scrape call errored: ${e.message}. ` +
        `Site publish is NOT affected — this only means the Page post was not attempted.`
    );
    return;
  }

  const message = `${post.title}\n\n${post.excerpt}`;
  try {
    const created = curlJson([
      `https://graph.facebook.com/${FB_API_VERSION}/${FB_PAGE_ID}/feed`,
      '-X', 'POST',
      '--data-urlencode', `message=${message}`,
      '--data-urlencode', `link=${url}`,
      '--data-urlencode', 'published=true',
      '--data-urlencode', `access_token=${FB_PAGE_TOKEN}`,
    ]);
    if (!created.id) {
      console.error(
        `FACEBOOK CROSS-POST FAILED (non-fatal): post creation returned no id: ` +
          `${JSON.stringify(created)}. Site publish is NOT affected.`
      );
      return;
    }
    console.log(`Facebook post created: ${created.id}. Site publish already succeeded independent of this step.`);
  } catch (e) {
    console.error(
      `FACEBOOK CROSS-POST FAILED (non-fatal): post creation call errored: ${e.message}. ` +
        `The Page's credentials are known-broken as of 2026-09-21 (Page never added to the ` +
        `Facebook App) — this is the EXPECTED failure until Josh fixes it in Meta Business ` +
        `Settings by hand. Site publish is NOT affected.`
    );
  }
}

function run() {
  console.log(`--- Starting Daily Publish: joshbyberg.com${DRY_RUN ? ' (DRY RUN, no git, no Facebook)' : ''} ---`);

  if (!DRY_RUN) {
    // H4-equivalent: assert we are actually on the publish branch before
    // doing anything. `git push origin main` pushes the REF named main, not
    // HEAD — on any other branch that push silently no-ops while the new
    // post sits stranded wherever HEAD actually was, and this script would
    // report success.
    let currentBranch;
    try {
      currentBranch = runGit(['rev-parse', '--abbrev-ref', 'HEAD']).trim();
    } catch (e) {
      console.error('Could not determine current branch. Not publishing.', e.message);
      process.exitCode = 1;
      return;
    }
    if (currentBranch !== PUBLISH_BRANCH) {
      console.error(
        `Refusing to publish: current branch is "${currentBranch}", not "${PUBLISH_BRANCH}". ` +
          `This script only publishes from ${PUBLISH_BRANCH}. Check out ${PUBLISH_BRANCH} and re-run.`
      );
      process.exitCode = 1;
      return;
    }

    // The clone this runs from (grandpa-desktop, unattended) can go stale
    // between cron firings on other repos/edits made elsewhere and pushed.
    // Fail loudly rather than push into that state; --ff-only refuses
    // silently rather than merging.
    try {
      runGit(['fetch', 'origin', PUBLISH_BRANCH], { stdio: 'inherit' });
      runGit(['pull', '--ff-only', 'origin', PUBLISH_BRANCH], { stdio: 'inherit' });
    } catch (e) {
      console.error('git pull --ff-only failed — local clone has diverged or has uncommitted changes. Not publishing.', e.message);
      process.exitCode = 1;
      return;
    }

    // H3-equivalent: `git pull --ff-only` is a no-op when local is AHEAD of
    // origin/main — it only protects against being BEHIND. So a run whose
    // commit succeeded but whose push failed leaves local ahead by one
    // commit, and the next run would publish a SECOND post the same day.
    // Explicitly refuse to proceed while local is ahead.
    let aheadCount;
    try {
      aheadCount = runGit(['rev-list', '--count', `origin/${PUBLISH_BRANCH}..HEAD`]).trim();
    } catch (e) {
      console.error('Could not compare local HEAD to origin/main. Not publishing.', e.message);
      process.exitCode = 1;
      return;
    }
    if (Number(aheadCount) > 0) {
      console.error(
        `Local ${PUBLISH_BRANCH} is ahead of origin/${PUBLISH_BRANCH} by ${aheadCount} commit(s). ` +
          `A previous run likely committed a post but failed to push it. Not publishing a new post — ` +
          `push the pending commit(s) (git push origin ${PUBLISH_BRANCH}) or otherwise resolve the ` +
          `divergence first, then re-run.`
      );
      process.exitCode = 1;
      return;
    }
  }

  const draft = getFirstDraft();
  if (!draft) {
    console.log('No joshbyberg drafts queued. Nothing to publish today.');
    return;
  }

  const published = processJoshbyberDraft(draft);
  if (!published) {
    console.error('Publish step failed; not committing.');
    process.exitCode = 1;
    return;
  }

  if (DRY_RUN) {
    console.log('--- Dry run complete. Not committing, pushing, or posting to Facebook. ---');
    return;
  }

  console.log('--- Committing to Git ---');
  try {
    runGit(['add', `src/content/${COLLECTION}`, `drafts/${COLLECTION}`]);
    const status = runGit(['status', '--porcelain', '--', `src/content/${COLLECTION}`, `drafts/${COLLECTION}`]);
    if (!status.trim()) {
      console.log('Nothing staged; skipping commit.');
      return;
    }
    runGit(['commit', '-m', `content(joshbyberg): daily publish - ${draft}`]);
    // Push HEAD to the explicit publish-branch ref rather than the bare
    // branch name, so this can never target anything other than what was
    // just committed. The branch guard above already ensures HEAD is main,
    // so this is belt-and-suspenders.
    runGit(['push', 'origin', `HEAD:refs/heads/${PUBLISH_BRANCH}`]);
    console.log('Successfully pushed to Git.');
  } catch (e) {
    console.error('Git commit/push failed.', e.message);
    process.exitCode = 1;
    return;
  }

  // Facebook step runs only after a successful site publish, and can never
  // change process.exitCode — a broken Page integration must never block or
  // fail the site publish. postToFacebook() already catches everything it
  // can throw internally; this outer try/catch (M1 fix, 2026-09-21 Opus
  // review) makes that guarantee structural rather than "every throw site
  // today happens to be inside a try" — a future edit to postToFacebook()
  // that adds an uncaught throw still cannot reach here.
  try {
    postToFacebook(published);
  } catch (e) {
    console.error(
      `FACEBOOK CROSS-POST FAILED (non-fatal, caught at the call site): ${e.message}. ` +
        `Site publish already succeeded and is NOT affected.`
    );
  }
}

run();
