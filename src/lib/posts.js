import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { remark } from 'remark'
import remarkGfm from 'remark-gfm'
import remarkHtml from 'remark-html'
import { imageSizeFromFile } from 'image-size/fromFile'

// brand: 'whitespace' | 'race-dad' | 'ai' | 'joshbyberg'
const CONTENT_ROOT = path.join(process.cwd(), 'src', 'content')
const PUBLIC_ROOT = path.join(process.cwd(), 'public')

const VALID_BRANDS = ['whitespace', 'race-dad', 'ai', 'joshbyberg']

function brandDir(brand) {
  if (!VALID_BRANDS.includes(brand)) {
    throw new Error(`Unknown brand: ${brand}`)
  }
  return path.join(CONTENT_ROOT, brand)
}

// Filenames may carry a numeric ordering prefix ("01-", "02-"); the slug never does.
function filenameToSlug(filename) {
  return filename.replace(/\.md$/, '').replace(/^\d+-/, '')
}

function normalizeDate(rawDate) {
  if (!rawDate) return null
  // gray-matter parses unquoted YAML dates into JS Date objects.
  const d = rawDate instanceof Date ? rawDate : new Date(rawDate)
  if (Number.isNaN(d.getTime())) {
    // Only fall back to a plain string when it actually looks like YYYY-MM-DD;
    // otherwise return null rather than emitting a value that `new Date(...)`
    // downstream would silently turn into "Invalid Date".
    if (typeof rawDate === 'string' && /^\d{4}-\d{2}-\d{2}/.test(rawDate)) {
      return rawDate.slice(0, 10)
    }
    return null
  }
  return d.toISOString().slice(0, 10)
}

function normalizeTags(rawTags) {
  if (!rawTags) return []
  if (Array.isArray(rawTags)) return rawTags
  if (typeof rawTags === 'string') {
    return rawTags
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean)
  }
  return []
}

function buildPost(brand, filename, data, extra = {}) {
  return {
    slug: filenameToSlug(filename),
    brand,
    title: data.title ?? '',
    date: normalizeDate(data.date),
    excerpt: data.excerpt ?? '',
    image: data.image ?? null,
    tags: normalizeTags(data.tags),
    type: data.type ?? 'post',
    client: data.client ?? null,
    deliverable: data.deliverable ?? null,
    trim: data.trim ?? null,
    colour: data.colour ?? null,
    author: data.author ?? null,
    video: data.video ?? null,
    ...extra,
  }
}

// Numeric filename prefixes are stripped when deriving a slug (see
// filenameToSlug), so two differently-named files can collide on the same
// slug (e.g. "01-foo.md" and "foo.md" both map to "foo"). A silent collision
// would produce either duplicate generateStaticParams entries or a
// nondeterministic `find` winner in filenameForSlug — both worse than a
// build failure, so we fail loudly and name the conflicting files.
function assertNoSlugCollisions(brand, files) {
  const seen = new Map() // slug -> filename
  for (const filename of files) {
    const slug = filenameToSlug(filename)
    const existing = seen.get(slug)
    if (existing) {
      throw new Error(
        `Slug collision in content/${brand}: "${existing}" and "${filename}" both resolve to slug "${slug}". Rename one of the files.`
      )
    }
    seen.set(slug, filename)
  }
}

function listMarkdownFilesIn(dir, label) {
  if (!fs.existsSync(dir)) return []
  const files = fs.readdirSync(dir).filter((f) => f.endsWith('.md'))
  assertNoSlugCollisions(label, files)
  return files
}

function listMarkdownFiles(brand) {
  return listMarkdownFilesIn(brandDir(brand), brand)
}

// -> Post[], sorted date DESC
export function getAllPosts(brand) {
  const files = listMarkdownFiles(brand)
  const posts = files.map((filename) => {
    const fullPath = path.join(brandDir(brand), filename)
    const raw = fs.readFileSync(fullPath, 'utf8')
    const { data } = matter(raw)
    return buildPost(brand, filename, data)
  })

  return posts.sort((a, b) => {
    if (!a.date && !b.date) return 0
    if (!a.date) return 1
    if (!b.date) return -1
    return a.date < b.date ? 1 : a.date > b.date ? -1 : 0
  })
}

// -> string[]
export function getPostSlugs(brand) {
  return listMarkdownFiles(brand).map(filenameToSlug)
}

function filenameForSlug(brand, slug) {
  const files = listMarkdownFiles(brand)
  return files.find((f) => filenameToSlug(f) === slug)
}

// remark-html sanitizes by default (its `sanitize` option is on unless
// explicitly disabled), so any raw HTML embedded in markdown is silently
// stripped from the output rather than rendered. This is a deliberate,
// inherited choice, not an oversight: post and track copy should stay plain
// markdown, and allowing raw HTML through would be a security decision (XSS
// surface) that this file does not want to own implicitly. If a future piece
// genuinely needs raw HTML, that requires an explicit, reviewed change here
// (e.g. `.use(remarkHtml, { sanitize: false })`) plus a sanitizer at the
// render boundary — not a silent default flip.

// remark-html emits body images as a bare `<img src alt>` with no intrinsic
// width/height, so the browser can't reserve space before decode and every
// image in a long post is fetched eagerly. This transform stamps each local
// image's real dimensions (plus async decoding and eager/lazy hints) onto the
// OUTPUT string of renderMarkdown — after sanitization, never by loosening it.
const IMG_TAG_RE = /<img\b[^>]*>/gi
const SRC_ATTR_RE = /\bsrc\s*=\s*(?:"([^"]*)"|'([^']*)')/i

function imgSrc(tag) {
  const match = tag.match(SRC_ATTR_RE)
  return match ? match[1] ?? match[2] : null
}

// Resolve a leading-slash src (e.g. "/images/x/y.jpg") against public/.
// External and non-absolute srcs return null and are left untouched.
function resolvePublicImage(src) {
  if (!src || !src.startsWith('/')) return null
  const clean = src.split(/[?#]/)[0]
  try {
    return path.join(PUBLIC_ROOT, decodeURIComponent(clean))
  } catch {
    return path.join(PUBLIC_ROOT, clean)
  }
}

const ATTR_EXISTS = (name) => new RegExp(`\\b${name}\\s*=`, 'i')

async function addImageDimensions(html) {
  const tags = [...html.matchAll(IMG_TAG_RE)]
  if (tags.length === 0) return html

  // Resolve every local image up front so we know which one is the first
  // renderable asset (the LCP candidate) before choosing eager vs lazy.
  const dims = await Promise.all(
    tags.map(async (match) => {
      const filePath = resolvePublicImage(imgSrc(match[0]))
      if (!filePath) return null
      try {
        const size = await imageSizeFromFile(filePath)
        if (Number.isFinite(size.width) && Number.isFinite(size.height)) {
          return { width: size.width, height: size.height }
        }
      } catch (err) {
        console.warn(`[posts] could not read image dimensions (${filePath}): ${err.message}`)
      }
      return null
    })
  )

  const firstLocal = dims.findIndex(Boolean)
  if (firstLocal === -1) return html

  let out = html
  // Walk backwards so earlier insertions don't shift later match offsets.
  for (let i = tags.length - 1; i >= 0; i--) {
    const dim = dims[i]
    if (!dim) continue

    const tag = tags[i][0]
    const isFirst = i === firstLocal
    const additions = [
      `width="${dim.width}"`,
      `height="${dim.height}"`,
      'decoding="async"',
      ...(isFirst
        ? ['fetchpriority="high"', 'loading="eager"']
        : ['loading="lazy"']),
    ].filter((attr) => !ATTR_EXISTS(attr.slice(0, attr.indexOf('='))).test(tag))

    if (additions.length === 0) continue

    // Insert immediately before the tag's closing bracket, tolerating a
    // self-closing "/>" in case the renderer someday emits one.
    let insertAt = tag.length - 1
    if (tag[insertAt - 1] === '/') insertAt -= 1

    const stamped =
      tag.slice(0, insertAt) + ' ' + additions.join(' ') + tag.slice(insertAt)
    out = out.slice(0, tags[i].index) + stamped + out.slice(tags[i].index + tag.length)
  }

  return out
}

async function renderMarkdown(content) {
  const processed = await remark().use(remarkGfm).use(remarkHtml).process(content)
  return addImageDimensions(processed.toString())
}

// -> Post & { contentHtml: string }
export async function getPost(brand, slug) {
  const filename = filenameForSlug(brand, slug)
  if (!filename) return null

  const fullPath = path.join(brandDir(brand), filename)
  const raw = fs.readFileSync(fullPath, 'utf8')
  const { data, content } = matter(raw)

  const contentHtml = await renderMarkdown(content)

  return buildPost(brand, filename, data, { contentHtml })
}


// ---------------------------------------------------------------------------
// Tracks
//
// racedad.ca also serves a handful of track guide pages backed by their own
// markdown collection in src/content/tracks/. These are a different shape from
// posts (location / website / relatedTags instead of date / excerpt / client),
// so they get their own loader rather than being forced through buildPost —
// but they reuse the same markdown pipeline and slug rules above.
// ---------------------------------------------------------------------------

const TRACKS_ROOT = path.join(CONTENT_ROOT, 'tracks')

function listTrackFiles() {
  return listMarkdownFilesIn(TRACKS_ROOT, 'tracks')
}

function buildTrack(filename, data, extra = {}) {
  return {
    slug: filenameToSlug(filename),
    title: data.title ?? '',
    location: data.location ?? '',
    summary: data.summary ?? '',
    website: data.website ?? null,
    websiteLabel: data.websiteLabel ?? null,
    relatedTags: normalizeTags(data.relatedTags),
    image: data.image ?? null,
    imageAlt: data.imageAlt ?? null,
    ...extra,
  }
}

// -> Track[], sorted by title
export function getAllTracks() {
  const files = listTrackFiles()
  return files
    .map((filename) => {
      const fullPath = path.join(TRACKS_ROOT, filename)
      const raw = fs.readFileSync(fullPath, 'utf8')
      const { data } = matter(raw)
      return buildTrack(filename, data)
    })
    .sort((a, b) => a.title.localeCompare(b.title))
}

// -> string[]
export function getTrackSlugs() {
  return listTrackFiles().map(filenameToSlug)
}

// -> Track & { contentHtml: string }
export async function getTrack(slug) {
  const filename = listTrackFiles().find((f) => filenameToSlug(f) === slug)
  if (!filename) return null

  const fullPath = path.join(TRACKS_ROOT, filename)
  const raw = fs.readFileSync(fullPath, 'utf8')
  const { data, content } = matter(raw)

  const contentHtml = await renderMarkdown(content)

  return buildTrack(filename, data, { contentHtml })
}
