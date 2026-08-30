#!/usr/bin/env node
// Grade every markdown file under src/content against the authoring contract
// in schema.mjs, plus the things the renderer will silently swallow: images
// that are not on disk, raw HTML the sanitizer strips, a duplicate H1.
//
//   node scripts/content/check-content.mjs [collection|file.md ...] [--json] [--strict]
//
// With no target it grades every collection; pass a path to grade one file.
//
// Exit codes: 0 clean (warnings allowed), 1 errors found.
// --strict promotes warnings to errors.

import fs from 'node:fs'
import path from 'node:path'
import matter from 'gray-matter'
import {
  COLLECTION_NAMES,
  DATE_RE,
  PUBLIC_ROOT,
  collectionDir,
  filenameToSlug,
  getCollection,
} from './schema.mjs'
import { RACEDAD_TAGS, tagToSlug } from '../../src/lib/race-dad-tags.js'

const RACEDAD_TAG_SLUGS = new Set(RACEDAD_TAGS.map((t) => t.slug))

const problems = []

function report(level, file, message) {
  problems.push({ level, file, message })
}

function isNonEmptyString(value) {
  return typeof value === 'string' && value.trim().length > 0
}

// gray-matter turns an unquoted YAML date into a JS Date; both shapes are
// accepted at runtime, so both are accepted here.
function dateProblem(raw) {
  if (raw instanceof Date) {
    return Number.isNaN(raw.getTime()) ? 'date is not a real date' : null
  }
  if (!isNonEmptyString(raw)) return 'date is missing'
  const value = raw.trim()
  if (!DATE_RE.test(value)) return `date must be YYYY-MM-DD, got "${raw}"`
  // new Date('2026-02-31') does not throw — it rolls over to March 3. Compare
  // the parsed parts back against what was written to catch that.
  const parsed = new Date(value + 'T00:00:00Z')
  if (Number.isNaN(parsed.getTime())) return `date is not a real date: "${raw}"`
  if (parsed.toISOString().slice(0, 10) !== value) {
    return `date "${value}" is not a real calendar date — it resolves to ${parsed.toISOString().slice(0, 10)}`
  }
  return null
}

function fieldPresent(data, field) {
  const value = data[field]
  if (value === undefined || value === null) return false
  if (Array.isArray(value)) return value.length > 0
  if (value instanceof Date) return true
  return isNonEmptyString(value)
}

// Site-absolute paths ("/images/...") must resolve to a real file in public/.
function checkLocalAsset(file, label, src) {
  if (!isNonEmptyString(src)) return
  if (/^https?:\/\//i.test(src)) return
  if (!src.startsWith('/')) {
    report('error', file, `${label} must be site-absolute ("/images/...") or an https URL, got "${src}"`)
    return
  }
  const clean = src.split(/[?#]/)[0]
  let resolved
  try {
    resolved = path.join(PUBLIC_ROOT, decodeURIComponent(clean))
  } catch {
    resolved = path.join(PUBLIC_ROOT, clean)
  }
  const relative = path.relative(PUBLIC_ROOT, resolved)
  if (relative.startsWith('..') || path.isAbsolute(relative)) {
    report('error', file, `${label} escapes public/ with a ".." segment: ${src}`)
    return
  }
  let stat
  try {
    stat = fs.statSync(resolved)
  } catch {
    report('error', file, `${label} points at a file that is not in public/: ${src}`)
    return
  }
  if (!stat.isFile()) {
    report('error', file, `${label} points at a directory, not an image file: ${src}`)
  }
}

const MD_IMAGE_RE = /!\[[^\]]*\]\(([^)\s]+)(?:\s+"[^"]*")?\)/g
const MD_IMAGE_ALT_RE = /!\[\s*\]\(/

// A post about HTML may legitimately show HTML, and a scaffold shows an
// example image path — inside a fenced block or backticks that is sample text,
// not output, so it is blanked before the body is graded.
function stripCode(text) {
  return text
    .replace(/^```[\s\S]*?^```/gm, '')
    .replace(/`[^`\n]*`/g, '')
}

function checkBody(file, body, { expectHeadings = true } = {}) {
  const trimmed = body.trim()
  if (trimmed.length === 0) {
    report('error', file, 'body is empty')
    return
  }
  if (trimmed.length < 400) {
    report('warn', file, `body is only ${trimmed.length} characters — is it finished?`)
  }

  const prose = stripCode(trimmed)

  if (/^#\s+/m.test(prose)) {
    report('warn', file, 'body contains an H1 ("# ..."); the page already renders the title as the h1 — use ## instead')
  }
  // Short pieces read fine as continuous prose; it is the long ones that need
  // signposting, so only those get nagged.
  if (expectHeadings && trimmed.length > 5000 && !/^##\s+/m.test(prose)) {
    report('warn', file, `body is ${trimmed.length} characters with no ## subheadings — hard to scan`)
  }

  // remark-html sanitizes, so raw HTML is dropped from the output entirely.
  const html = trimmed.match(/<\/?(div|span|img|br|p|a|iframe|section|figure|table)\b[^>]*>/i)
  if (html) {
    report('error', file, `raw HTML is stripped by the renderer and will not appear: ${html[0]}`)
  }

  for (const match of prose.matchAll(MD_IMAGE_RE)) {
    checkLocalAsset(file, 'body image', match[1])
  }
  if (MD_IMAGE_ALT_RE.test(prose)) {
    report('warn', file, 'a body image has empty alt text')
  }
}

function checkTags(file, collectionName, tags) {
  // A missing tags field is already reported by the required-field pass; only
  // grade the shape of one that is actually there.
  if (tags === undefined || tags === null) return
  if (!Array.isArray(tags)) {
    report('error', file, 'tags must be a list')
    return
  }
  if (tags.length === 0) return
  for (const tag of tags) {
    if (!isNonEmptyString(tag)) report('error', file, 'a tag is empty')
  }
  if (collectionName === 'race-dad') {
    const hub = tags.some((t) => RACEDAD_TAG_SLUGS.has(tagToSlug(String(t))))
    if (!hub) {
      report(
        'warn',
        file,
        `no tag maps to a rebuilt racedad.ca tag hub (${[...RACEDAD_TAG_SLUGS].join(', ')}) — the post will not show up on any tag page`
      )
    }
  }
}

function checkFile(collectionName, collection, filename) {
  const filePath = path.join(collectionDir(collectionName), filename)
  const file = `src/content/${collection.dir}/${filename}`

  let parsed
  try {
    parsed = matter(fs.readFileSync(filePath, 'utf8'))
  } catch (err) {
    report('error', file, `frontmatter does not parse: ${err.message}`)
    return
  }
  const { data, content } = parsed

  if (Object.keys(data).length === 0) {
    report('error', file, 'no frontmatter block (--- ... ---) at the top of the file')
    return
  }

  const type = data.type
  const required = [
    ...collection.required,
    ...(collection.requiredByType?.[type] ?? []),
  ]
  for (const field of required) {
    if (!fieldPresent(data, field)) {
      report('error', file, `missing required field: ${field}`)
    }
  }

  if (collection.types.length) {
    if (isNonEmptyString(type) && !collection.types.includes(type)) {
      report('error', file, `type "${type}" is not one of: ${collection.types.join(', ')}`)
    }
  }

  const known = new Set([
    ...collection.required,
    ...collection.optional,
    ...Object.values(collection.requiredByType ?? {}).flat(),
  ])
  for (const key of Object.keys(data)) {
    if (!known.has(key)) {
      report('warn', file, `unknown frontmatter field "${key}" — src/lib/posts.js will ignore it`)
    }
  }

  if (collectionName !== 'tracks') {
    const problem = dateProblem(data.date)
    if (problem) report('error', file, problem)

    const excerpt = data.excerpt
    if (isNonEmptyString(excerpt)) {
      const length = excerpt.trim().length
      if (length < 60) report('warn', file, `excerpt is short (${length} chars) — aim for 100-250`)
      if (length > 320) report('warn', file, `excerpt is long (${length} chars) — it gets truncated on cards`)
    }

    checkTags(file, collectionName, data.tags)

    if (data.video !== undefined && data.video !== null) {
      if (!/^https:\/\//.test(String(data.video))) {
        report('error', file, 'video must be an https URL')
      }
    }
  } else {
    if (!Array.isArray(data.relatedTags) || data.relatedTags.length === 0) {
      report('warn', file, 'relatedTags is empty — the track page will list no related posts')
    }
    if (isNonEmptyString(data.image) && !isNonEmptyString(data.imageAlt)) {
      report('warn', file, 'image has no imageAlt')
    }
  }

  for (const [key, value] of Object.entries(data)) {
    if (typeof value === 'string' && value.includes('TODO')) {
      report('error', file, `${key} still contains a TODO placeholder`)
    }
  }

  checkLocalAsset(file, 'image', data.image)
  checkBody(file, content, { expectHeadings: collectionName !== 'tracks' })
}

// A single-file check still has to see its neighbours: a slug collision is a
// property of the directory, and it fails the whole build. Collected per
// collection so checking two files in one run reports it once.
function checkSlugCollisions(collectionName) {
  const collection = getCollection(collectionName)
  const dir = collectionDir(collectionName)
  if (!fs.existsSync(dir)) return
  const bySlug = new Map()
  for (const filename of fs.readdirSync(dir).filter((f) => f.endsWith('.md'))) {
    const slug = filenameToSlug(filename)
    const existing = bySlug.get(slug)
    if (existing) {
      report(
        'error',
        `src/content/${collection.dir}`,
        `slug collision: "${existing}" and "${filename}" both resolve to "${slug}" — the build will fail`
      )
    } else {
      bySlug.set(slug, filename)
    }
  }
}

// Resolve "src/content/ai/foo.md" (or any path to a file inside a collection)
// back to the collection it belongs to. Lets an agent grade only the file it
// just wrote instead of the whole site.
function resolveFileTarget(target) {
  const abs = path.resolve(target)
  for (const name of COLLECTION_NAMES) {
    const dir = collectionDir(name)
    const rel = path.relative(dir, abs)
    if (rel && !rel.startsWith('..') && !path.isAbsolute(rel) && !rel.includes(path.sep)) {
      return { collectionName: name, filename: rel }
    }
  }
  return null
}

function checkCollection(collectionName) {
  const collection = getCollection(collectionName)
  const dir = collectionDir(collectionName)
  if (!fs.existsSync(dir)) {
    report('error', `src/content/${collection.dir}`, 'collection directory does not exist')
    return 0
  }

  const files = fs.readdirSync(dir).filter((f) => f.endsWith('.md'))

  checkSlugCollisions(collectionName)

  for (const filename of files) {
    // The loader strips one leading "NN-" off every filename to get the slug.
    // In a collection that does not use prefixes that strip is unintended, and
    // in one that does, a SECOND numeric group gets eaten too — either way the
    // file serves at a URL that is not what the filename reads as, and another
    // file can then collide with it invisibly.
    const stripped = collection.numbered ? filename.replace(/^\d+-/, '') : filename
    if (/^\d+-/.test(stripped)) {
      report(
        'error',
        `src/content/${collection.dir}/${filename}`,
        `this serves at "${filenameToSlug(filename)}", not "${filename.replace(/\.md$/, '')}" — the loader strips the leading digits as a filename prefix. Rename it to start with a letter.`
      )
    }
    if (!/^[a-z0-9][a-z0-9-]*\.md$/.test(filename.replace(/^\d+-/, ''))) {
      report(
        'warn',
        `src/content/${collection.dir}/${filename}`,
        'filename should be lowercase-hyphenated (optionally with a NN- prefix)'
      )
    }
    checkFile(collectionName, collection, filename)
  }

  return files.length
}

function main() {
  const args = process.argv.slice(2)
  const json = args.includes('--json')
  const strict = args.includes('--strict')
  const requested = args.filter((a) => !a.startsWith('--'))

  for (const name of requested) {
    if (!name.endsWith('.md') && !COLLECTION_NAMES.includes(name)) {
      console.error(
        `error: unknown collection "${name}". Valid: ${COLLECTION_NAMES.join(', ')} (or a path to a .md file)`
      )
      process.exit(1)
    }
  }

  const files = requested.filter((a) => a.endsWith('.md'))
  const collections = requested.filter((a) => !a.endsWith('.md'))

  let count = 0
  let targets

  if (files.length) {
    targets = []
    const scanned = new Set()
    for (const target of files) {
      const resolved = resolveFileTarget(target)
      if (!resolved) {
        console.error(`error: "${target}" is not a markdown file inside src/content/<collection>/`)
        process.exit(1)
      }
      if (!fs.existsSync(path.join(collectionDir(resolved.collectionName), resolved.filename))) {
        console.error(`error: no such file: ${target}`)
        process.exit(1)
      }
      checkFile(resolved.collectionName, getCollection(resolved.collectionName), resolved.filename)
      scanned.add(resolved.collectionName)
      targets.push(target)
      count++
    }
    for (const name of scanned) {
      if (!collections.includes(name)) checkSlugCollisions(name)
    }
    for (const name of collections) count += checkCollection(name)
    targets = targets.concat(collections)
  } else {
    targets = collections.length ? collections : COLLECTION_NAMES
    for (const name of targets) count += checkCollection(name)
  }

  const errors = problems.filter((p) => p.level === 'error')
  const warnings = problems.filter((p) => p.level === 'warn')

  if (json) {
    console.log(
      JSON.stringify(
        { checked: count, collections: targets, errors, warnings, ok: errors.length === 0 && (!strict || warnings.length === 0) },
        null,
        2
      )
    )
  } else {
    const byFile = new Map()
    for (const problem of problems) {
      if (!byFile.has(problem.file)) byFile.set(problem.file, [])
      byFile.get(problem.file).push(problem)
    }
    for (const [file, list] of byFile) {
      console.log(file)
      for (const p of list) {
        console.log(`  ${p.level === 'error' ? 'ERROR' : 'warn '}  ${p.message}`)
      }
      console.log('')
    }
    console.log(
      `checked ${count} file${count === 1 ? '' : 's'} in ${targets.join(', ')} — ` +
        `${errors.length} error${errors.length === 1 ? '' : 's'}, ` +
        `${warnings.length} warning${warnings.length === 1 ? '' : 's'}`
    )
  }

  process.exit(errors.length > 0 || (strict && warnings.length > 0) ? 1 : 0)
}

main()
