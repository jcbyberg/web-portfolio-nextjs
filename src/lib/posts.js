import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { remark } from 'remark'
import remarkGfm from 'remark-gfm'
import remarkHtml from 'remark-html'

// brand: 'whitespace' | 'race-dad' | 'ai'
const CONTENT_ROOT = path.join(process.cwd(), 'src', 'content')

const VALID_BRANDS = ['whitespace', 'race-dad', 'ai']

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
    tags: normalizeTags(data.tags),
    type: data.type ?? 'post',
    client: data.client ?? null,
    deliverable: data.deliverable ?? null,
    trim: data.trim ?? null,
    colour: data.colour ?? null,
    author: data.author ?? null,
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

function listMarkdownFiles(brand) {
  const dir = brandDir(brand)
  if (!fs.existsSync(dir)) return []
  const files = fs.readdirSync(dir).filter((f) => f.endsWith('.md'))
  assertNoSlugCollisions(brand, files)
  return files
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

// -> Post & { contentHtml: string }
export async function getPost(brand, slug) {
  const filename = filenameForSlug(brand, slug)
  if (!filename) return null

  const fullPath = path.join(brandDir(brand), filename)
  const raw = fs.readFileSync(fullPath, 'utf8')
  const { data, content } = matter(raw)

  // remark-html sanitizes by default (its `sanitize` option is on unless
  // explicitly disabled), so any raw HTML embedded in a post's markdown is
  // silently stripped from the output rather than rendered. This is a
  // deliberate, inherited choice, not an oversight: post content should stay
  // plain markdown, and allowing raw HTML through would be a security
  // decision (XSS surface) that this file does not want to own implicitly.
  // If a future post genuinely needs raw HTML, that requires an explicit,
  // reviewed change here (e.g. `.use(remarkHtml, { sanitize: false })`)
  // plus a sanitizer at the render boundary — not a silent default flip.
  const processed = await remark().use(remarkGfm).use(remarkHtml).process(content)
  const contentHtml = processed.toString()

  return buildPost(brand, filename, data, { contentHtml })
}
