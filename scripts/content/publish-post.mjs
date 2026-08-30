#!/usr/bin/env node
// One command that takes a draft to a verified, built page.
//
//   node scripts/content/publish-post.mjs <collection> --title "..." --body-file draft.md [options]
//
// It runs the three steps a post has always needed — scaffold, check, build —
// and then does the one nobody remembers: confirms the page actually came out
// of the build with the right title on it. Exit code 0 means the post exists,
// passes the checker, and rendered. Anything else means it did not, and the
// last block printed says which step failed and what to do about it.
//
// This exists because a delegated agent gets one shot at a command. Four
// commands with a judgement call between each is where the work goes missing.
//
// Options: every flag new-post.mjs takes (--tags, --excerpt, --date, --image,
// --slug, --type, --client, --deliverable, --author, --video, --location,
// --summary, --force, ...) plus:
//
//   --title "..."      the post title (or pass it positionally after the collection)
//   --body-file <path> the draft body, markdown, no frontmatter (or "-" for stdin)
//   --no-build         stop after the checker; use while iterating on the body
//   --json             machine-readable result on stdout, logs on stderr
//
// Read .claude/skills/write-blog-post/SKILL.md for what belongs in the body.

import { spawnSync } from 'node:child_process'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import {
  COLLECTION_NAMES,
  FLAGS_WITH_VALUE,
  REPO_ROOT,
  collectionDir,
  filenameToSlug,
  getCollection,
  slugify,
} from './schema.mjs'

const HERE = path.dirname(fileURLToPath(import.meta.url))
const NEW_POST = path.join(HERE, 'new-post.mjs')
const CHECK = path.join(HERE, 'check-content.mjs')

// Flags this wrapper consumes rather than forwarding to new-post.mjs.
const OWN_VALUE_FLAGS = new Set(['title'])
const OWN_BOOL_FLAGS = new Set(['no-build', 'json'])


let JSON_MODE = false

function log(...args) {
  // In --json mode stdout carries the payload and nothing else.
  if (JSON_MODE) console.error(...args)
  else console.log(...args)
}

function die(step, message, hint) {
  const payload = { ok: false, step, error: message, ...(hint ? { hint } : {}) }
  if (JSON_MODE) {
    console.log(JSON.stringify(payload, null, 2))
  } else {
    console.error(`\nFAILED at ${step}: ${message}`)
    if (hint) console.error(`\n${hint}`)
  }
  process.exit(1)
}

function usage() {
  console.error(
    `usage: node scripts/content/publish-post.mjs <${COLLECTION_NAMES.join('|')}> --title "The Title" --body-file draft.md [options]`
  )
  console.error('       see the comment block at the top of this file')
  process.exit(1)
}

// Split argv into what we handle and what new-post.mjs handles. We do not need
// to know new-post's flags — anything we do not claim is forwarded verbatim,
// so the two stay in step when new-post grows a flag.
function partitionArgs(argv) {
  const mine = { title: null, noBuild: false, json: false }
  const forwarded = []
  const positional = []

  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i]
    if (!arg.startsWith('--')) {
      positional.push(arg)
      continue
    }
    const [name, inlineValue] = arg.slice(2).split(/=(.*)/s)
    if (OWN_VALUE_FLAGS.has(name)) {
      const value = inlineValue ?? argv[++i]
      if (value === undefined) die('arguments', `--${name} needs a value`)
      mine[name] = value
      continue
    }
    if (OWN_BOOL_FLAGS.has(name)) {
      if (name === 'no-build') mine.noBuild = true
      if (name === 'json') mine.json = true
      continue
    }
    forwarded.push(arg)
    // Whether a forwarded flag consumes the next argument is not a guess — it
    // is FLAGS_WITH_VALUE, the same table new-post.mjs parses with. Consume it
    // even when it looks like a flag, so an excerpt of "--no-build" survives,
    // and never consume for a boolean, so `--force "Title"` keeps the title.
    if (inlineValue === undefined && FLAGS_WITH_VALUE.has(name)) {
      const value = argv[++i]
      if (value === undefined) die('arguments', `--${name} needs a value`)
      forwarded.push(value)
    }
  }
  return { mine, forwarded, positional }
}

function run(label, command, args, options = {}) {
  const result = spawnSync(command, args, {
    cwd: REPO_ROOT,
    encoding: 'utf8',
    shell: false,
    ...options,
  })
  if (result.error) die(label, `could not run ${command}: ${result.error.message}`)
  return result
}

// Run Next's own binary under this node rather than shelling out to `npm run
// build`. npm on Windows is npm.cmd, and since Node 20 spawnSync refuses a .cmd
// without a shell (EINVAL) — and turning the shell on to fix that would put
// every argument back through cmd.exe quoting. This sidesteps both.
function nextBinary() {
  const bin = path.join(REPO_ROOT, 'node_modules', 'next', 'dist', 'bin', 'next')
  if (!fs.existsSync(bin)) {
    die('build', 'next is not installed', 'Run `npm install` in the repo, then try again.')
  }
  return bin
}

// Where the built page for this post must be — an exact path from the
// collection's declared buildDir, not a search for <slug>.html.
//
// Searching was wrong twice over. Two collections can hold the same slug
// (race-dad/08-circuit-mecaglisse.md and tracks/circuit-mecaglisse.md both
// exist today), and the serving URL is not the build directory for half of
// them: race-dad serves at racedad.ca/<slug> but builds to race-dad/, and
// tracks serves at /tracks/<slug> but builds to race-dad/tracks/. A search
// that guessed from the URL picked the other collection's page, found the same
// title in its h1, and reported DONE for a post that never rendered.
function builtPagePath(slug, collectionName) {
  const { buildDir } = getCollection(collectionName)
  return path.join(REPO_ROOT, '.next', 'server', 'app', ...buildDir.split('/'), `${slug}.html`)
}

// Every other <slug>.html in the build, for the error message when the expected
// one is missing — that it landed somewhere else is the whole clue.
function otherPagesForSlug(slug, expected) {
  const root = path.join(REPO_ROOT, '.next', 'server', 'app')
  if (!fs.existsSync(root)) return []
  const target = `${slug}.html`
  const found = []
  const stack = [root]
  while (stack.length) {
    const dir = stack.pop()
    let entries
    try {
      entries = fs.readdirSync(dir, { withFileTypes: true })
    } catch {
      continue
    }
    for (const entry of entries) {
      const full = path.join(dir, entry.name)
      if (entry.isDirectory()) stack.push(full)
      else if (entry.name === target && full !== expected) {
        found.push(path.relative(REPO_ROOT, full).split(path.sep).join('/'))
      }
    }
  }
  return found
}

// Copy a post that --force is about to overwrite somewhere safe.
function backupExisting(collectionName, forwardedArgs, title) {
  // Derive the slug exactly as new-post.mjs will, or the backup protects the
  // wrong file. Two ways to get this wrong, both of which did:
  //   - only reading `--slug value` and missing `--slug=value`
  //   - trusting the supplied slug raw. new-post.mjs applies slugify() to it,
  //     so `--slug "My Slug"` overwrites my-slug.md, and a raw comparison
  //     against normalized filenames matched nothing and backed up nothing.
  let supplied = null
  for (let i = 0; i < forwardedArgs.length; i++) {
    const [name, inline] = forwardedArgs[i].replace(/^--/, '').split(/=(.*)/s)
    if (name !== 'slug') continue
    supplied = inline ?? forwardedArgs[i + 1]
    if (inline === undefined) i++ // consume the value, as the scaffolder does
  }
  const slug = slugify(supplied || title)
  const dir = collectionDir(collectionName)
  let existing
  try {
    existing = fs
      .readdirSync(dir)
      .filter((f) => f.endsWith('.md') && filenameToSlug(f) === slug)
      .map((f) => path.join(dir, f))
  } catch {
    return null
  }
  if (existing.length === 0) return null
  const stamp = new Date().toISOString().replace(/[:.]/g, '-')
  const target = path.join(os.tmpdir(), `${slug}.${stamp}.md.bak`)
  fs.copyFileSync(existing[0], target)
  return target
}

function main() {
  const argv = process.argv.slice(2)
  if (argv.length === 0 || argv.includes('--help') || argv.includes('-h')) usage()

  const { mine, forwarded, positional } = partitionArgs(argv)
  JSON_MODE = mine.json

  const collection = positional.shift()
  if (!collection) usage()
  if (!COLLECTION_NAMES.includes(collection)) {
    die('arguments', `unknown collection "${collection}"`, `Valid collections: ${COLLECTION_NAMES.join(', ')}`)
  }

  // Title may come from --title or from the words after the collection, which
  // is how new-post.mjs takes it. Accept both so neither form surprises anyone.
  const title = mine.title ?? (positional.length ? positional.join(' ') : null)
  if (!title) die('arguments', 'no title', 'Pass --title "The Title Of The Post".')

  const label = getCollection(collection).label

  // --force overwrites a file that is already published. Keep a copy outside
  // the repo first, so a bad draft over a good post is recoverable.
  const forcing = forwarded.some((a) => a === '--force' || a.startsWith('--force='))
  const backup = forcing ? backupExisting(collection, forwarded, title) : null
  if (backup) log(`      (--force: previous version copied to ${backup})`)

  // ---- step 1: scaffold -------------------------------------------------
  log(`[1/3] scaffolding into ${label} ...`)
  // stdin is inherited so `--body-file -` reads the draft piped into us.
  const scaffold = run(
    'scaffold',
    process.execPath,
    [NEW_POST, collection, title, ...forwarded, '--json'],
    { stdio: ['inherit', 'pipe', 'pipe'] }
  )
  if (scaffold.status !== 0) {
    die(
      'scaffold',
      (scaffold.stderr || scaffold.stdout || '').trim() || `new-post.mjs exited ${scaffold.status}`,
      'Nothing was written. Fix the arguments and run the same command again.'
    )
  }

  let created
  try {
    created = JSON.parse(scaffold.stdout)
  } catch {
    die('scaffold', `could not parse the scaffolder output:\n${scaffold.stdout}`)
  }

  const relFile = created.file ?? created.path
  if (!relFile) die('scaffold', `the scaffolder did not report a file:\n${scaffold.stdout}`)
  const absFile = path.isAbsolute(relFile) ? relFile : path.join(REPO_ROOT, relFile)
  const slug = created.slug
  const url = created.url

  log(`      wrote ${relFile}`)

  // ---- step 2: check ----------------------------------------------------
  log('[2/3] checking frontmatter, images, slug collisions ...')
  const check = run('check', process.execPath, [CHECK, relFile])
  const checkOutput = `${check.stdout ?? ''}${check.stderr ?? ''}`.trim()
  if (check.status !== 0) {
    die(
      'check',
      checkOutput || `check-content.mjs exited ${check.status}`,
      [
        `The file exists at ${relFile} but does not pass. Errors must be zero;`,
        'warnings are advice. Two ways on from here:',
        '',
        `  - edit ${relFile} directly, then: npm run content:check -- ${relFile}`,
        '  - or fix your draft and re-run this same command with --force added,',
        '    which overwrites the file that was just written.',
      ].join('\n')
    )
  }
  log(`      ${checkOutput.split('\n').pop()}`)

  if (mine.noBuild) {
    const payload = { ok: true, built: false, collection, slug, file: relFile, url, check: checkOutput }
    if (JSON_MODE) console.log(JSON.stringify(payload, null, 2))
    else {
      log('\n[3/3] skipped (--no-build)')
      log(`\nfile  ${relFile}`)
      log(`url   ${url}`)
      log('\nNot done yet. Run without --no-build to prove the page renders.')
    }
    return
  }

  // ---- step 3: build, then prove the page came out of it ----------------
  log('[3/3] building (this takes a couple of minutes) ...')
  const build = run('build', process.execPath, [nextBinary(), 'build'])
  if (build.status !== 0) {
    const tail = `${build.stdout ?? ''}${build.stderr ?? ''}`.trim().split('\n').slice(-25).join('\n')
    die(
      'build',
      `npm run build exited ${build.status}`,
      [
        `The file at ${relFile} passed the checker but broke the build.`,
        'Last lines of the build output:',
        '',
        tail,
      ].join('\n')
    )
  }

  const builtPage = builtPagePath(slug, collection)
  const relBuiltExpected = path.relative(REPO_ROOT, builtPage).split(path.sep).join('/')
  if (!fs.existsSync(builtPage)) {
    const elsewhere = otherPagesForSlug(slug, builtPage)
    die(
      'verify',
      `the build succeeded but ${relBuiltExpected} was not emitted`,
      [
        'The post did not become a page where this collection serves from. Usual',
        'causes: the file is in the wrong collection directory, or a future-dated',
        `post is being filtered out — check the date in ${relFile}.`,
        ...(elsewhere.length
          ? [
              '',
              `A page with this slug does exist at: ${elsewhere.join(', ')}.`,
              "That is another collection's post of the same name, not this one.",
            ]
          : []),
      ].join('\n')
    )
  }

  // The page existing is not enough — an empty shell would pass that. Confirm
  // the title rendered into the page's own heading, not merely somewhere in the
  // document: it appears in <head> metadata and in the serialised payload of
  // every index card too, so a whole-file search would pass on a blank post.
  const html = fs.readFileSync(builtPage, 'utf8')
  const relBuilt = path.relative(REPO_ROOT, builtPage).split(path.sep).join('/')
  const headings = [...html.matchAll(/<h1[^>]*>([\s\S]*?)<\/h1>/g)].map((m) =>
    m[1].replace(/<[^>]+>/g, '').trim()
  )
  const wanted = [title, escapeHtml(title)]
  const titleRendered = headings.some((h) => wanted.some((w) => h.includes(w)))

  if (!titleRendered) {
    die(
      'verify',
      `${relBuilt} was built, but its <h1> is not the post title`,
      [
        `Found h1: ${headings.length ? headings.map((h) => JSON.stringify(h)).join(', ') : '(none)'}`,
        `Expected: ${JSON.stringify(title)}`,
        '',
        'The page exists but is not rendering this post. Open it before shipping:',
        `  ${localUrl(url)}`,
      ].join('\n')
    )
  }

  const payload = {
    ok: true,
    built: true,
    collection,
    slug,
    file: relFile,
    url,
    builtPage: relBuilt,
    titleRendered,
  }

  if (JSON_MODE) {
    console.log(JSON.stringify(payload, null, 2))
  } else {
    log('')
    log('DONE — scaffolded, checked, built, and the title rendered as the page h1.')
    log('')
    log(`file   ${relFile}`)
    log(`page   ${relBuilt}`)
    log(`url    ${url}`)
    log('')
    log('Last step is yours — look at it:')
    for (const line of previewInstructions(url)) log(`  ${line}`)
  }
}

// Turn the production URL into how you actually open the page locally.
//
// /blog and /blog/* are the catch here: next.config.js 308-redirects them to
// ai.whitespacedesign.ca unless the request carries x-wsai-proxy, the header the
// Cloudflare worker sets when it fetches that section. So `npm run dev` and open
// the URL — which is what the docs used to say — bounces you to the live site
// and looks like the post failed to build.
function previewInstructions(productionUrl) {
  const pathname = new URL(productionUrl).pathname
  const local = `http://localhost:3000${pathname}`
  const lines = ['npm run dev', `open ${local}`]
  if (pathname === '/blog' || pathname.startsWith('/blog/')) {
    lines.push(
      '',
      'That path redirects to production in dev unless the request carries the',
      'header the Cloudflare worker sets, so to see the local page use:',
      `  curl -H "x-wsai-proxy: 1" ${local}`,
      'or open it through a proxy that adds that header.'
    )
  }
  return lines
}

function localUrl(productionUrl) {
  return `http://localhost:3000${new URL(productionUrl).pathname}`
}

function escapeHtml(text) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
}

main()
