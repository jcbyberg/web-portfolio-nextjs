#!/usr/bin/env node
// Daily publish job for whitespacedesign.ca ONLY.
//
// Promotes the single oldest draft in drafts/whitespace/ into
// src/content/whitespace/, commits, and pushes to main. That push is what
// "publishes" it — posts.js has no date-gate, so anything committed to
// src/content/whitespace is live the moment Vercel finishes the next build.
// Running this script more than once in a day therefore publishes more than
// one post that day; it is meant to be invoked by cron exactly once daily.
//
// Scope, deliberately narrow (2026-09-20):
//   - This repo (web-portfolio-nextjs) also has drafts/ai and drafts/race-dad
//     queues and a shared scripts/content/publish-daily.mjs that used to walk
//     all three. That script's cron entry was disabled 2026-09-18 because its
//     "ai" branch duplicated a purpose-built Python publisher
//     (daily_ai_blog_publish_linux.py) that owns ai.whitespacedesign.ca via a
//     separate queue file — see .reviews/daily-publish-script-review-round4-
//     linux-port.md finding 1 in D:/meta-automation. Disabling the WHOLE
//     shared script also stopped whitespace's and race-dad's publishing as
//     collateral damage, not by design.
//   - Separately, racedad.ca does NOT deploy from this repo at all (verified
//     2026-09-20 via the Cloudflare/Vercel APIs) — it is a standalone Astro
//     project at D:/race-dad deployed with wrangler, with its own cron. So
//     the old script's drafts/race-dad branch has been writing content into
//     this repo that was never going anywhere. This script does not touch
//     drafts/race-dad or drafts/ai at all, on purpose. Old
//     scripts/content/publish-daily.mjs is left in place, still disabled in
//     crontab, and is not modified by this file.
//
// Usage:
//   node scripts/content/publish-daily-whitespace.mjs           # publish + commit + push
//   node scripts/content/publish-daily-whitespace.mjs --dry-run # scaffold + build only, no git
//
// Hardening (2026-09-21, review .reviews/main-9db6168c360f.md, 4 HIGH findings):
//   H1 — a draft with "### Option A:" but no "### Option B:" used to publish
//        everything after Option A (including internal marketing notes) as
//        the post body. Fixed: the script now requires "### Option B:" to be
//        present after "### Option A:" and refuses to publish, loudly, when
//        it is missing.
//   H2 — title/excerpt/tags/type were interpolated into an execSync shell
//        string, so a draft containing `"`, `$()`, backticks or `;` could run
//        arbitrary commands on the host that pushes to production. Fixed: the
//        publisher is now invoked with spawnSync + an argv array (shell:
//        false, no shell string ever built), calling
//        scripts/content/publish-post.mjs directly instead of going through
//        `npm run content:post --`.
//   H3 — a push that failed after a successful commit went undetected on the
//        next run (the --ff-only guard is a no-op when the local branch is
//        AHEAD of origin/main — "Already up to date", exit 0), so the next
//        cron firing published a second post the same day. Fixed: after
//        fetching, the script refuses to proceed if local main is ahead of
//        origin/main — that state means a previous run committed but did not
//        finish pushing, and that must be resolved (push it, or fix the repo)
//        before a new post is created.
//   H4 — `git push origin main` pushes the ref named `main`, not HEAD, so on
//        any other branch it silently pushed nothing, exited 0, and reported
//        success while the new post was stranded on the wrong branch. Fixed:
//        the script now asserts it is actually on `main` before doing
//        anything, and pushes `HEAD:refs/heads/main` explicitly.
//
// Facebook cross-post (2026-09-21):
//   After a successful site publish (commit + push), the same post is
//   cross-posted to the "Whitespace Design" Facebook Page, via
//   scripts/content/facebook-publish.mjs — the same poll/scrape/post/verify
//   pattern already trusted unattended for ai.whitespacedesign.ca. Two rules
//   this must never violate, both enforced by where the call sits below:
//     - it runs ONLY after the git push has already succeeded, and its own
//       failure never rolls back or re-does that push — the site content is
//       the more important side effect;
//     - it is idempotent across re-runs via its own ledger file
//       (.whitespace-facebook-ledger.json, gitignored), keyed by slug and
//       checked BEFORE any Graph API call — not by the site-publish state,
//       since the draft file (the only prior "not yet published" signal) is
//       deleted the moment the site publish succeeds.
//   The caption is never generated here — it is pulled verbatim from the
//   draft's own "## 4. Facebook hooks" / "Hook A (for Option A)" line
//   (this script always publishes Option A's body), and a draft missing
//   that line fails the Facebook step loudly rather than inventing one.

import fs from 'fs';
import os from 'os';
import path from 'path';
import { spawnSync } from 'child_process';
import { fileURLToPath } from 'url';
import { extractFacebookHook, postDraftToFacebook } from './facebook-publish.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const REPO_ROOT = path.resolve(__dirname, '../../');
const DRY_RUN = process.argv.includes('--dry-run');
const PUBLISH_POST = path.join(__dirname, 'publish-post.mjs');
const PUBLISH_BRANCH = 'main';

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
  const draftsDir = path.join(REPO_ROOT, 'drafts', 'whitespace');
  if (!fs.existsSync(draftsDir)) return null;

  // Sort explicitly. fs.readdirSync's order is the underlying filesystem's
  // native directory order, which is NOT guaranteed alphabetical and is NOT
  // guaranteed to match between hosts — this job authors on Windows (NTFS)
  // but runs unattended on grandpa-desktop (ext4/Linux). An unsorted pick
  // would make "which post goes out today" depend on which filesystem is
  // running the job, which is not something anyone could predict or debug.
  const files = fs
    .readdirSync(draftsDir)
    .filter((f) => f.endsWith('.md'))
    .sort();
  if (files.length === 0) return null;

  return files[0];
}

// Extract the Option A body. Requires BOTH "### Option A:" and a following
// "### Option B:" to be present — H1. Without a terminating Option B, the
// old code fell back to "rest of the file", which for six drafts currently
// queued means internal marketing/process notes (e.g. a "Facebook Cross-Post
// Ideas" section, hashtags, "Link in bio!") published straight to production.
// Refusing loudly here is the fix; the draft files themselves are a content
// problem, not something this script tries to repair.
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
        `or pull it from drafts/whitespace/ if it isn't ready.`
    );
    return null;
  }

  let body = content.slice(aIndex + OPTION_A.length, bIndex).trim();
  body = body.replace(/^\*\[.*\]\*\n*/, '');
  return body;
}

function processWhitespaceDraft(filename) {
  const filePath = path.join(REPO_ROOT, 'drafts', 'whitespace', filename);
  const content = fs.readFileSync(filePath, 'utf8');

  const titleMatch = content.match(/- \*\*Title:\*\* (.*)/);
  const excerptMatch = content.match(/- \*\*Excerpt:\*\* (.*)/);
  const tagsMatch = content.match(/- \*\*Tags:\*\* (.*)/);
  const typeMatch = content.match(/- \*\*Type:\*\* (.*)/);

  if (!titleMatch || !excerptMatch || !tagsMatch) {
    console.error(`Missing metadata in ${filename}`);
    process.exitCode = 1;
    return false;
  }

  const title = titleMatch[1].trim();
  const excerpt = excerptMatch[1].trim();
  const tags = tagsMatch[1].trim();
  const type = typeMatch ? typeMatch[1].trim() : 'essay';

  const body = extractOptionABody(content, filename);
  if (body === null) {
    process.exitCode = 1;
    return false;
  }

  // Early, non-blocking check (Opus review MEDIUM-2, 2026-09-21): surface a
  // missing Facebook hook now, before the several-minute build below, not
  // only after a successful commit+push. This does NOT gate the site
  // publish — it always proceeds regardless — it only makes the eventual
  // Facebook-step failure predictable instead of a surprise several
  // minutes later. The real enforcement is extractFacebookHook() being
  // called again, for real, after the push (see run()).
  try {
    extractFacebookHook(content, filename, 'A');
  } catch (e) {
    console.error(`NOTE (Facebook step will fail after this publishes): ${e.message}`);
  }

  // Written outside the repo (os.tmpdir()) rather than into drafts/whitespace/
  // itself, so a hard kill can't leave a stray .md file in the directory this
  // script scans for the next draft to publish.
  const tempBodyPath = path.join(os.tmpdir(), `whitespace-daily-body-${process.pid}-${Date.now()}.md`);
  fs.writeFileSync(tempBodyPath, body);

  console.log(`Publishing Whitespace post: ${title}`);

  // H2 fix: spawnSync with an argv array, shell: false (the default for
  // spawnSync, made explicit below) — title/excerpt/tags/type never pass
  // through any shell, so no character in a draft file can break out of a
  // command. Calling publish-post.mjs directly also drops the `npm run`
  // layer, which was the only remaining place a shell got involved.
  const args = [
    PUBLISH_POST,
    'whitespace',
    '--type', type,
    '--title', title,
    '--excerpt', excerpt,
    '--tags', tags,
    '--body-file', tempBodyPath,
    // --json so the caller can recover the slug/url publish-post.mjs
    // derived (needed for the Facebook step below) without re-deriving
    // slugify() logic here. Human-readable logs still stream live: in
    // --json mode publish-post.mjs sends them to stderr, which stays
    // 'inherit'; only stdout (the final JSON payload) is captured.
    '--json',
  ];
  if (DRY_RUN) args.push('--no-build');

  try {
    const result = spawnSync(process.execPath, args, {
      cwd: REPO_ROOT,
      encoding: 'utf8',
      stdio: ['inherit', 'pipe', 'inherit'],
      shell: false,
    });
    if (result.error) {
      throw result.error;
    }
    if (result.status !== 0) {
      // Opus review MEDIUM-1 (2026-09-21): in --json mode, publish-post.mjs's
      // die() writes the failure payload to STDOUT (see publish-post.mjs:61-68),
      // and stdout is now piped (captured), not inherited — so without this,
      // the only thing that reached the log on failure was a bare exit code.
      const raw = (result.stdout || '').trim();
      let reason = raw;
      try {
        const failed = JSON.parse(raw);
        if (failed?.error) reason = `[${failed.step}] ${failed.error}`;
      } catch {
        // raw wasn't JSON (e.g. a crash before die() could run) — fall back
        // to printing it verbatim below.
      }
      console.error(`Failed to publish ${filename}: publish-post.mjs exited with code ${result.status}${reason ? `\n${reason}` : ''}`);
      process.exitCode = 1;
      return false;
    }
    let payload;
    try {
      payload = JSON.parse(result.stdout);
    } catch {
      console.error(`Failed to publish ${filename}: could not parse publish-post.mjs JSON output:\n${result.stdout}`);
      process.exitCode = 1;
      return false;
    }
    console.log(`      wrote ${payload.file}`);
    console.log(`      url   ${payload.url}`);
    if (!DRY_RUN) fs.unlinkSync(filePath); // Delete draft after successful publish
    // content is returned alongside the publish-post.mjs payload so the
    // caller can pull the Facebook hook out of it after this function
    // returns — filePath is gone by then (deleted above), so this is the
    // only copy of the draft's own text left in memory.
    return { title, content, slug: payload.slug, url: payload.url };
  } catch (e) {
    console.error(`Failed to publish ${filename}`, e.message);
    process.exitCode = 1;
    return false;
  } finally {
    if (fs.existsSync(tempBodyPath)) fs.unlinkSync(tempBodyPath);
  }
}

async function run() {
  console.log(`--- Starting Daily Publish: whitespacedesign.ca${DRY_RUN ? ' (DRY RUN, no git)' : ''} ---`);

  if (!DRY_RUN) {
    // H4 fix: assert we are actually on the publish branch before doing
    // anything. `git push origin main` pushes the REF named main, not HEAD —
    // on any other branch that push silently no-ops (exit 0, "Everything
    // up-to-date") while the new post sits stranded wherever HEAD actually
    // was, and this script would report success.
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

    // The clone this runs from (grandpa-desktop, unattended) can go stale for
    // days between cron firings on other repos/edits made elsewhere and pushed.
    // Measured 2026-09-20: that clone was 43 commits behind origin/main. Reading
    // drafts/ and committing on top of a stale HEAD risks re-publishing an
    // already-published draft or a non-fast-forward push. Fail loudly rather
    // than push into that state; --ff-only refuses silently rather than merging.
    try {
      runGit(['fetch', 'origin', PUBLISH_BRANCH], { stdio: 'inherit' });
      runGit(['pull', '--ff-only', 'origin', PUBLISH_BRANCH], { stdio: 'inherit' });
    } catch (e) {
      console.error('git pull --ff-only failed — local clone has diverged or has uncommitted changes. Not publishing.', e.message);
      process.exitCode = 1;
      return;
    }

    // H3 fix: `git pull --ff-only` is a no-op (exit 0, "Already up to date")
    // when local is AHEAD of origin/main — it only protects against being
    // BEHIND. So a run whose commit succeeded but whose push failed (network
    // blip, credential hiccup) leaves local ahead by one commit, the guard
    // above passes clean on the next run, and that run publishes a SECOND
    // post the same day. Explicitly refuse to proceed while local is ahead —
    // that state means a previous run did not finish, and finishing it (push
    // the pending commit, or investigate) comes before publishing anything
    // new.
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
    console.log('No whitespace drafts queued. Nothing to publish today.');
    return;
  }

  const published = processWhitespaceDraft(draft);
  if (!published) {
    console.error('Publish step failed; not committing.');
    process.exitCode = 1;
    return;
  }

  if (DRY_RUN) {
    console.log('--- Dry run complete. Not committing or pushing. ---');
    return;
  }

  console.log('--- Committing to Git ---');
  let pushed = false;
  try {
    runGit(['add', 'src/content/whitespace', 'drafts/whitespace']);
    const status = runGit(['status', '--porcelain', '--', 'src/content/whitespace', 'drafts/whitespace']);
    if (!status.trim()) {
      console.log('Nothing staged; skipping commit.');
      return;
    }
    runGit(['commit', '-m', `content(whitespace): daily publish - ${draft}`]);
    // H4 fix (continued): push HEAD to the explicit publish-branch ref rather
    // than the bare branch name, so this can never target anything other
    // than what was just committed. The branch guard above already ensures
    // HEAD is main, so this is belt-and-suspenders.
    runGit(['push', 'origin', `HEAD:refs/heads/${PUBLISH_BRANCH}`]);
    console.log('Successfully pushed to Git.');
    pushed = true;
  } catch (e) {
    console.error('Git commit/push failed.', e.message);
    process.exitCode = 1;
    return;
  }

  if (!pushed) return;

  // --- Facebook cross-post. Runs ONLY after the push above has already
  // succeeded. The site content is live (or on its way live) the moment
  // that push lands, and is by far the more important side effect — a
  // failure anywhere below must be visible (non-zero exit, clear log) but
  // must never attempt to undo or repeat the git commit/push.
  console.log('--- Posting to Facebook (Whitespace Design Page) ---');
  try {
    const hook = extractFacebookHook(published.content, draft, 'A');
    const result = await postDraftToFacebook({
      slug: published.slug,
      url: published.url,
      title: published.title,
      hook,
    });
    if (result.skipped) {
      console.log(`Facebook: "${published.slug}" was already posted (id=${result.postId}); nothing to do.`);
    } else {
      console.log(`Facebook: posted, id=${result.postId}`);
    }
  } catch (e) {
    console.error(
      'Facebook post step failed (the site publish above already succeeded and is NOT being rolled back):',
      e.message
    );
    process.exitCode = 1;
  }
}

run().catch((e) => {
  console.error('Unhandled error in publish-daily-whitespace.mjs:', e);
  process.exitCode = 1;
});
