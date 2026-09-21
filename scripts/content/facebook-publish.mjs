#!/usr/bin/env node
// Posts a just-published whitespacedesign.ca post to the "Whitespace Design"
// Facebook Page.
//
// Ports the same battle-tested pattern already trusted unattended for
// ai.whitespacedesign.ca — /home/josh/automation/daily_ai_blog_publish_linux.py,
// which went through three rounds of adversarial Opus review before being
// allowed to run on cron: poll the live URL, force a fresh og:image scrape,
// create the link-share post, then verify a real attachment landed. One
// deliberate divergence: that script also requires the post's image to be
// live at a real byte size before posting, because `image` is a REQUIRED
// field for the `ai` collection. It is OPTIONAL for `whitespace`
// (scripts/content/schema.mjs), so this module does not hard-fail on a
// missing og:image — it force-scrapes and logs what Facebook found, but
// only a failed *call* (network/auth) is fatal, not an absent image.
//
// Deliberately separate from the site-publish step in
// publish-daily-whitespace.mjs: this module is only ever called AFTER a
// successful git commit+push, and a failure here must never roll back or
// duplicate that push (see the caller). It keeps its own ledger
// (LEDGER_FILE) so "already posted to Facebook" is tracked independently
// of "already published to the site" — the draft file is deleted the
// moment the site publish succeeds, so it cannot be used as that signal,
// and a re-run of the daily script always advances to the next queued
// draft rather than reprocessing this one. The ledger exists for the
// cases that isn't true: a manual retry against the same slug (via this
// file's own CLI, below) after a Facebook-step failure, or a future
// resume mode. It refuses a second attempt exactly the way the Python
// script's `post_attempted_at` field does.
//
// Standalone CLI — manual recovery, or testing idempotency without
// touching the live Page twice:
//   node scripts/content/facebook-publish.mjs <slug> <url> <hook-file> [title]

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const REPO_ROOT = path.resolve(__dirname, '../../')

const GRAPH_VERSION = 'v21.0'

// Path to the credentials file, not a secret itself — overridable for
// testing off the production host. The values inside are read at runtime
// only and are never logged, printed, or embedded in an error message.
const FB_ENV_FILE = process.env.WHITESPACE_FB_ENV_FILE || '/home/josh/automation/data/.env'

// Untracked (see .gitignore) — deliberately kept outside src/content and
// outside drafts/, so it is never touched by the git add/commit/push this
// script's caller does for the site content itself.
const LEDGER_FILE =
  process.env.WHITESPACE_FB_LEDGER_FILE || path.join(REPO_ROOT, '.whitespace-facebook-ledger.json')

const POLL_TIMEOUT_MS = 10 * 60 * 1000
const POLL_INTERVAL_MS = 15 * 1000
const FETCH_TIMEOUT_MS = 30 * 1000
const ATTACHMENT_RETRIES = 4
const ATTACHMENT_RETRY_DELAY_MS = 5 * 1000

function redact(value) {
  return String(value).replace(/access_token=[^&\s]+/g, 'access_token=***REDACTED***')
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

async function fetchWithTimeout(url, options = {}, timeoutMs = FETCH_TIMEOUT_MS) {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), timeoutMs)
  try {
    return await fetch(url, { ...options, signal: controller.signal })
  } catch (e) {
    // The underlying fetch/Abort error text does not normally embed the
    // request URL, but redact it anyway on the way out in case a future
    // Node version changes that.
    throw new Error(`request to ${redact(url)} failed: ${redact(e.message)}`)
  } finally {
    clearTimeout(timer)
  }
}

export function loadFacebookEnv(envFile = FB_ENV_FILE) {
  let raw
  try {
    raw = fs.readFileSync(envFile, 'utf8')
  } catch (e) {
    throw new Error(`could not read Facebook credentials file ${envFile}: ${e.message}`)
  }
  const env = {}
  for (const line of raw.split('\n')) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#') || !trimmed.includes('=')) continue
    const idx = trimmed.indexOf('=')
    const key = trimmed.slice(0, idx).trim()
    let value = trimmed.slice(idx + 1).trim()
    value = value.replace(/^['"]|['"]$/g, '')
    env[key] = value
  }
  const pageId = env.WS_PAGE_ID
  const token = env.WS_PAGE_ACCESS_TOKEN
  if (!pageId || !token) {
    throw new Error(`${envFile} is missing WS_PAGE_ID or WS_PAGE_ACCESS_TOKEN`)
  }
  return { pageId, token }
}

function readLedger() {
  try {
    return JSON.parse(fs.readFileSync(LEDGER_FILE, 'utf8'))
  } catch (e) {
    if (e.code === 'ENOENT') return {}
    throw new Error(`could not read/parse Facebook ledger ${LEDGER_FILE}: ${e.message}`)
  }
}

function writeLedgerAtomic(ledger) {
  const tmp = `${LEDGER_FILE}.tmp-${process.pid}-${Date.now()}`
  fs.writeFileSync(tmp, JSON.stringify(ledger, null, 2) + '\n')
  fs.renameSync(tmp, LEDGER_FILE)
}

// Read-modify-write a single slug's entry, re-reading the file fresh right
// before merging and writing it — never reusing an in-memory ledger object
// captured earlier in this call. This repo runs on a single cron slot, but
// a manual retry/testing run (this file's own CLI, or a resumed hung
// invocation) can genuinely overlap a still-running one. Reviewed and
// fixed 2026-09-21 (Opus Tier-2 review, HIGH-1): a version of this file
// that carried one `ledger` snapshot across the whole postDraftToFacebook()
// call and wrote it back twice was reproduced, with two interleaved
// processes, to silently erase an already-`posted: true` record — the
// second writer's stale full-object write clobbered the first writer's
// update. This does not add a lock (a genuinely concurrent write to the
// SAME slug from two processes racing inside this function is still
// possible in principle — there is no cross-process mutex here), but it
// closes the reproduced failure mode: every write is now a fresh
// read-merge-write of just the one key that changed, so an update to a
// DIFFERENT slug made by another process in between can no longer be lost.
function updateLedgerEntry(slug, patch) {
  const ledger = readLedger()
  ledger[slug] = { ...(ledger[slug] || {}), ...patch }
  writeLedgerAtomic(ledger)
  return ledger[slug]
}

// Extracts the caption text this script needs. publish-daily-whitespace.mjs
// always publishes the "### Option A:" body (extractOptionABody there), so
// this always pulls "Hook A (for Option A)" — never write new caption
// copy, the draft's own "## 4. Facebook hooks" section exists specifically
// for this. Missing entirely (true for a large share of the currently
// queued whitespace drafts) is a hard refusal, matching the same
// fail-closed discipline as extractOptionABody's own H1 fix: this script
// does not invent a caption, and does not silently skip posting without
// saying so loudly.
function escapeRegExp(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

export function extractFacebookHook(content, filename, option = 'A') {
  const label = `Hook ${option} (for Option ${option})`
  const re = new RegExp(`\\*\\*${escapeRegExp(label)}:\\*\\*\\s*(.+)`)
  const match = content.match(re)
  if (!match) {
    throw new Error(
      `No "- **${label}:**" line found under "## 4. Facebook hooks" in ${filename}. Refusing to post ` +
        `to Facebook — this script never writes new caption text, only uses what the draft already has. ` +
        `Add the hook to the draft before it is queued again, or post this one by hand.`
    )
  }
  // Strip the internal authoring note — the Graph `link` parameter already
  // attaches the URL as a real link-share card, so "(Assumes link in
  // body)" is an instruction to whoever writes the hook, not caption copy.
  return match[1].replace(/\s*\(assumes link in body\)\s*$/i, '').trim()
}

async function pollLiveUrl(url, slug) {
  const deadline = Date.now() + POLL_TIMEOUT_MS
  while (Date.now() < deadline) {
    try {
      const res = await fetchWithTimeout(url)
      const body = await res.text()
      if (res.status === 200 && body.includes(slug)) return true
      console.error(`  poll: ${url} returned ${res.status} (waiting for a real 200 containing "${slug}")`)
    } catch (e) {
      console.error(`  poll request failed, retrying: ${e.message}`)
    }
    if (Date.now() < deadline) await sleep(POLL_INTERVAL_MS)
  }
  return false
}

async function scrapeConfirmOgImage(url, token) {
  const endpoint = `https://graph.facebook.com/${GRAPH_VERSION}/?id=${encodeURIComponent(url)}&scrape=true&access_token=${encodeURIComponent(token)}`
  const res = await fetchWithTimeout(endpoint, { method: 'POST' })
  const data = await res.json().catch(() => null)
  if (!res.ok || !data) {
    throw new Error(`Facebook scrape call failed (HTTP ${res.status}): ${redact(JSON.stringify(data))}`)
  }
  const images = data.image || []
  console.error(`  scrape: og:title=${JSON.stringify(data.title)} og:image=${images[0]?.url ? 'present' : 'none (ok, image is optional for this collection)'}`)
  return data
}

async function postToFeed({ pageId, token, message, link }) {
  const endpoint = `https://graph.facebook.com/${GRAPH_VERSION}/${pageId}/feed`
  const body = new URLSearchParams({ message, link, published: 'true', access_token: token })
  const res = await fetchWithTimeout(endpoint, { method: 'POST', body })
  const data = await res.json().catch(() => null)
  if (!res.ok || !data || !data.id) {
    throw new Error(`Facebook post creation failed (HTTP ${res.status}): ${redact(JSON.stringify(data))}`)
  }
  return data.id
}

async function verifyAttachment(postId, token) {
  for (let attempt = 1; attempt <= ATTACHMENT_RETRIES; attempt++) {
    await sleep(ATTACHMENT_RETRY_DELAY_MS)
    try {
      const endpoint = `https://graph.facebook.com/${GRAPH_VERSION}/${postId}/attachments?access_token=${encodeURIComponent(token)}`
      const res = await fetchWithTimeout(endpoint)
      const data = await res.json().catch(() => null)
      const attachments = data?.data || []
      if (attachments[0]?.title && attachments[0]?.media) {
        console.error(`  attachment verified: title=${JSON.stringify(attachments[0].title)}`)
        return true
      }
      console.error(`  attachment not populated yet (attempt ${attempt}/${ATTACHMENT_RETRIES}): ${redact(JSON.stringify(data))}`)
    } catch (e) {
      console.error(`  attachment check failed (attempt ${attempt}/${ATTACHMENT_RETRIES}): ${e.message}`)
    }
  }
  return false
}

// The orchestrator. Returns { skipped: true, postId } if this slug was
// already posted (idempotent no-op) or { skipped: false, postId } on a
// fresh post. Throws on any real failure — the caller is responsible for
// logging it and exiting non-zero without touching git again.
export async function postDraftToFacebook({ slug, url, title, hook }) {
  if (!slug || !url || !hook) {
    throw new Error('postDraftToFacebook requires slug, url and hook')
  }

  const ledger = readLedger()
  const entry = ledger[slug]

  if (entry?.posted === true) {
    console.error(
      `Facebook: "${slug}" is already marked posted (id=${entry.facebookPostId}, at ${entry.postedAt}) — skipping, not re-posting.`
    )
    return { skipped: true, postId: entry.facebookPostId }
  }
  if (entry?.attemptedAt && entry?.posted !== true) {
    throw new Error(
      `A Facebook post was already attempted for "${slug}" at ${entry.attemptedAt} and never confirmed ` +
        `posted. It may already be live on the Page — check by hand before doing anything else. If it is ` +
        `NOT live, remove the "${slug}" entry from ${LEDGER_FILE} and re-run.`
    )
  }

  const { pageId, token } = loadFacebookEnv()

  console.error(`Facebook: waiting for ${url} to go live...`)
  const live = await pollLiveUrl(url, slug)
  if (!live) {
    throw new Error(
      `Timed out after ${POLL_TIMEOUT_MS / 1000}s waiting for ${url} to return a live 200. Not posting to Facebook.`
    )
  }
  console.error(`Facebook: ${url} is live.`)

  console.error('Facebook: forcing a fresh scrape...')
  await scrapeConfirmOgImage(url, token)

  // Record the attempt BEFORE the POST call. If the call times out or the
  // connection drops after Graph has already created the post, there is no
  // way to tell success from failure from here — so the ledger must refuse
  // a further attempt rather than silently retrying and risking a
  // duplicate post.
  updateLedgerEntry(slug, { attemptedAt: new Date().toISOString(), url, title })

  console.error('Facebook: creating the post...')
  const postId = await postToFeed({ pageId, token, message: hook, link: url })
  console.error(`Facebook: post created, id=${postId}`)

  updateLedgerEntry(slug, {
    posted: true,
    postedAt: new Date().toISOString(),
    facebookPostId: postId,
  })
  console.error(`Facebook: "${slug}" marked posted in the ledger — a re-run will not repost it.`)

  const attachmentOk = await verifyAttachment(postId, token)
  if (!attachmentOk) {
    console.error(
      `Facebook: WARNING — could not confirm a real link-card attachment on post ${postId} after ` +
        `${ATTACHMENT_RETRIES} attempts. The post IS live and IS marked posted; check it by hand: ` +
        `https://graph.facebook.com/${GRAPH_VERSION}/${postId}?fields=permalink_url&access_token=<token>`
    )
  }

  return { skipped: false, postId }
}

// --- standalone CLI: manual recovery / idempotency testing ---------------
async function main() {
  const [slug, url, hookFile, title] = process.argv.slice(2)
  if (!slug || !url || !hookFile) {
    console.error('usage: node scripts/content/facebook-publish.mjs <slug> <url> <hook-file> [title]')
    process.exit(1)
  }
  const hook = fs.readFileSync(hookFile, 'utf8').trim()
  try {
    const result = await postDraftToFacebook({ slug, url, title: title || slug, hook })
    console.log(JSON.stringify(result))
  } catch (e) {
    console.error('Facebook post failed:', e.message)
    process.exit(1)
  }
}

if (process.argv[1] && path.resolve(process.argv[1]) === __filename) {
  main()
}
