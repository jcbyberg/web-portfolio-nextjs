#!/usr/bin/env node
// Scaffold a new content file with correct frontmatter for its collection.
//
//   node scripts/content/new-post.mjs <collection> "<Title>" [options]
//
// Options:
//   --slug <slug>          override the slug derived from the title
//   --date <YYYY-MM-DD>    default: today
//   --type <type>          post | case-study (collection dependent)
//   --tags "a, b, c"       comma separated
//   --excerpt "..."        one or two sentences; shown on the index and in search
//   --image <path>         site-absolute, e.g. /images/race-dad/foo/bar.jpg
//   --video <url>          race-dad only, https URL to an mp4
//   --author "Name"
//   --client "Name"        whitespace case studies
//   --deliverable "..."    whitespace case studies
//   --location "..."       tracks
//   --summary "..."        tracks
//   --body-file <path>     read the post body from a file (or "-" for stdin)
//   --no-number            skip the numeric filename prefix
//   --force                overwrite an existing file with the same slug
//   --json                 machine-readable result
//
// Writes the file, then prints where it landed and the URL it will serve at.

import fs from 'node:fs'
import path from 'node:path'
import {
  COLLECTION_NAMES,
  DATE_RE,
  FLAGS_WITH_VALUE,
  collectionDir,
  filenameToSlug,
  getCollection,
  slugify,
  todayISO,
} from './schema.mjs'

function fail(message) {
  console.error(`error: ${message}`)
  process.exit(1)
}

function parseArgs(argv) {
  const positional = []
  const flags = {}
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i]
    if (!arg.startsWith('--')) {
      positional.push(arg)
      continue
    }
    const [name, inlineValue] = arg.slice(2).split(/=(.*)/s)
    if (FLAGS_WITH_VALUE.has(name)) {
      const value = inlineValue ?? argv[++i]
      if (value === undefined) fail(`--${name} needs a value`)
      flags[name] = value
    } else {
      flags[name] = true
    }
  }
  return { positional, flags }
}

function usage() {
  console.error(
    `usage: node scripts/content/new-post.mjs <${COLLECTION_NAMES.join('|')}> "<Title>" [options]`
  )
  console.error('       see the comment block at the top of this file for every option')
  process.exit(1)
}

// The YAML we emit is deliberately narrow: double-quoted scalars with the
// characters that can break them escaped, and block sequences for lists. That
// covers every field these collections use without pulling in a YAML writer.
// Backslash and quote would close the scalar early; a newline or tab pasted
// into --excerpt would break the block open, so those become escapes too.
// Any other control character (a stray \x07 pasted in from a terminal, say) is
// outright illegal in a YAML scalar and would make the file unparseable at
// build time, so it is emitted as a \xNN escape rather than raw.
const CONTROL_CHAR_RE = /[\x00-\x08\x0b\x0c\x0e-\x1f\x7f]/g

function yamlString(value) {
  const escaped = String(value)
    .replace(/\\/g, '\\\\')
    .replace(/"/g, '\\"')
    .replace(/\r?\n/g, '\\n')
    .replace(/\t/g, '\\t')
    .replace(CONTROL_CHAR_RE, (ch) =>
      '\\x' + ch.charCodeAt(0).toString(16).padStart(2, '0')
    )
  return `"${escaped}"`
}

function yamlList(values) {
  if (values.length === 0) return ' []'
  return '\n' + values.map((v) => `  - ${yamlString(v)}`).join('\n')
}

function splitList(raw) {
  if (!raw) return []
  return raw
    .split(',')
    .map((t) => t.trim())
    .filter(Boolean)
}

function nextNumberPrefix(dir) {
  const numbers = fs
    .readdirSync(dir)
    .filter((f) => f.endsWith('.md'))
    .map((f) => /^(\d+)-/.exec(f))
    .filter(Boolean)
    .map((m) => Number(m[1]))
  const next = numbers.length ? Math.max(...numbers) + 1 : 1
  return String(next).padStart(2, '0')
}

function readBody(flags) {
  const source = flags['body-file']
  if (!source) return null
  if (source === '-') return fs.readFileSync(0, 'utf8')
  if (!fs.existsSync(source)) fail(`--body-file not found: ${source}`)
  return fs.readFileSync(source, 'utf8')
}

// The rendered page prints the title as the <h1>, so a body opening with its
// own "# Title" would show it twice. Demote a leading H1, and drop a
// frontmatter block if the body file already carried one of its own.
function normalizeBody(raw, title) {
  let body = raw.replace(/^﻿/, '')
  if (body.startsWith('---')) {
    const end = body.indexOf('\n---', 3)
    if (end !== -1) {
      const afterFence = body.indexOf('\n', end + 1)
      body = afterFence === -1 ? '' : body.slice(afterFence + 1)
    }
  }
  body = body.replace(/^\s+/, '')
  const firstLine = body.split('\n', 1)[0]
  if (/^#\s+/.test(firstLine)) {
    const heading = firstLine.replace(/^#\s+/, '').trim()
    body =
      heading.toLowerCase() === String(title).trim().toLowerCase()
        ? body.slice(firstLine.length).replace(/^\s+/, '')
        : '## ' + body.slice(2)
  }
  return body.trimEnd() + '\n'
}

function placeholderBody(collectionDirName, slug) {
  return [
    'Open with the concrete thing that happened. Skip the preamble.',
    '',
    '## The first turn',
    '',
    'Body copy is plain markdown. Raw HTML is stripped by the renderer, so',
    'pictures go in as markdown, pointing at a real file under public/:',
    '',
    '```',
    `![Describe what is in the picture](/images/${collectionDirName}/${slug}/photo.jpg)`,
    '```',
    '',
    'Headings start at ## — the page already renders the title as the h1.',
    '',
  ].join('\n')
}

function main() {
  const { positional, flags } = parseArgs(process.argv.slice(2))
  if (flags.help || positional.length < 2) usage()

  const [collectionName, title] = positional
  let collection
  try {
    collection = getCollection(collectionName)
  } catch (err) {
    fail(err.message)
  }
  const dir = collectionDir(collectionName)

  const slug = slugify(flags.slug || title)
  if (!slug) fail('could not derive a slug from that title — pass --slug explicitly')

  // src/lib/posts.js strips a leading "NN-" off every filename to get the slug,
  // so a slug that itself starts with digits-and-a-dash (a title like "2099
  // Goals") would be silently truncated at runtime: the page would serve at a
  // different URL than the one printed here, and the collision check below
  // would compare the wrong strings and overwrite an existing post.
  if (/^\d+-/.test(slug)) {
    fail(
      `slug "${slug}" starts with digits and a dash, which the loader strips as a filename prefix — ` +
        `it would serve as "${filenameToSlug(slug + '.md')}". Pass --slug with a non-numeric start.`
    )
  }

  const date = flags.date || todayISO()
  if (!DATE_RE.test(date)) fail(`--date must be YYYY-MM-DD, got "${date}"`)

  const type = flags.type || collection.defaultType
  if (collection.types.length && !collection.types.includes(type)) {
    fail(`--type must be one of: ${collection.types.join(', ')}`)
  }

  fs.mkdirSync(dir, { recursive: true })
  const existing = fs.readdirSync(dir).filter((f) => f.endsWith('.md'))
  const collision = existing.find((f) => filenameToSlug(f) === slug)
  if (collision && !flags.force) {
    fail(
      `slug "${slug}" already exists as src/content/${collection.dir}/${collision}. ` +
        'Pick a different title or --slug, or pass --force to overwrite it.'
    )
  }

  const useNumber = collection.numbered && !flags['no-number']
  const filename =
    collision || `${useNumber ? nextNumberPrefix(dir) + '-' : ''}${slug}.md`
  const filePath = path.join(dir, filename)

  // Belt and braces: the slug comparison above is the meaningful check, but
  // never clobber a file on disk without --force whatever the slug logic says.
  if (!collision && fs.existsSync(filePath) && !flags.force) {
    fail(`${filename} already exists in src/content/${collection.dir}. Pass --force to overwrite it.`)
  }

  const defaults = collection.defaults || {}
  const value = (name) => flags[name] ?? defaults[name] ?? null

  const lines = ['---']
  const put = (key, raw) => {
    if (raw === null || raw === undefined || raw === '') return
    lines.push(`${key}: ${yamlString(raw)}`)
  }

  if (collectionName === 'tracks') {
    put('title', title)
    put('location', value('location') ?? 'TODO — town, province')
    put('summary', value('summary') ?? 'TODO — one sentence describing the circuit.')
    put('website', value('website'))
    put('websiteLabel', value('website-label'))
    lines.push(`relatedTags:${yamlList(splitList(flags['related-tags']))}`)
    put('image', value('image'))
    put('imageAlt', value('image-alt'))
  } else {
    put('title', title)
    put('date', date)
    put('type', type)
    put('author', value('author'))
    put('client', value('client'))
    put('deliverable', value('deliverable'))
    put('trim', value('trim'))
    put('colour', value('colour'))
    put(
      'excerpt',
      value('excerpt') ??
        'TODO — one or two sentences for the index card and search results.'
    )
    lines.push(`tags:${yamlList(splitList(flags.tags))}`)
    put('image', value('image'))
    put('video', value('video'))
  }
  lines.push('---', '', '')

  const rawBody = readBody(flags)
  const body =
    rawBody === null ? placeholderBody(collection.dir, slug) : normalizeBody(rawBody, title)

  fs.writeFileSync(filePath, lines.join('\n') + body, 'utf8')

  const relative = path.relative(process.cwd(), filePath).split(path.sep).join('/')
  const url = collection.url(slug)

  if (flags.json) {
    console.log(
      JSON.stringify(
        { file: relative, slug, url, collection: collectionName, date, type },
        null,
        2
      )
    )
    return
  }

  console.log(`created  ${relative}`)
  console.log(`slug     ${slug}`)
  console.log(`url      ${url}`)
  console.log(`images   ${collection.imageDir}/${slug}/  (create it if the post has pictures)`)
  console.log('')
  console.log('Next: write the body, then run  npm run content:check')
}

main()
