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
    // Fall back to a plain string that already looks like YYYY-MM-DD.
    return typeof rawDate === 'string' ? rawDate.slice(0, 10) : null
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

function listMarkdownFiles(brand) {
  const dir = brandDir(brand)
  if (!fs.existsSync(dir)) return []
  return fs.readdirSync(dir).filter((f) => f.endsWith('.md'))
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

  const processed = await remark().use(remarkGfm).use(remarkHtml).process(content)
  const contentHtml = processed.toString()

  return buildPost(brand, filename, data, { contentHtml })
}
