// Single source of truth for what a content file must look like.
//
// Both scripts/content/new-post.mjs (which writes files) and
// scripts/content/check-content.mjs (which grades them) read this, so a
// scaffolded file passes the checker by construction. src/lib/posts.js stays
// the runtime loader — this file describes the authoring contract around it.

import path from 'node:path'
import { fileURLToPath } from 'node:url'

export const REPO_ROOT = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '..',
  '..'
)
export const CONTENT_ROOT = path.join(REPO_ROOT, 'src', 'content')
export const PUBLIC_ROOT = path.join(REPO_ROOT, 'public')

// A "collection" is one directory under src/content. Three of them are post
// brands; `tracks` is a different shape that racedad.ca also serves.
export const COLLECTIONS = {
  whitespace: {
    label: 'Whitespace Design',
    dir: 'whitespace',
    url: (slug) => `https://whitespacedesign.ca/whitespace/${slug}`,
    // Where this collection's pages land under .next/server/app. NOT derivable
    // from `url`: race-dad serves at racedad.ca/<slug> but builds to race-dad/,
    // and tracks serves at /tracks/<slug> but builds to race-dad/tracks/.
    buildDir: 'whitespace',
    // Filenames carry an ordering prefix ("07-"); the slug never does.
    numbered: true,
    // Only 'case-study' renders differently ([slug]/page.js); anything else
    // renders as an essay. 'essay' and 'post' both exist in the wild.
    types: ['case-study', 'essay', 'post'],
    defaultType: 'case-study',
    required: ['title', 'date', 'type', 'excerpt', 'tags'],
    // Required only for a given type.
    requiredByType: { 'case-study': ['client', 'deliverable'] },
    optional: ['client', 'deliverable', 'trim', 'colour', 'image', 'author'],
    imageDir: 'public/images/whitespace',
  },
  'race-dad': {
    label: 'Race Dad',
    dir: 'race-dad',
    url: (slug) => `https://racedad.ca/${slug}`,
    buildDir: 'race-dad',
    numbered: true,
    types: ['post'],
    defaultType: 'post',
    required: ['title', 'date', 'type', 'excerpt', 'author', 'tags'],
    requiredByType: {},
    optional: ['image', 'video'],
    defaults: { author: 'Josh Byberg' },
    imageDir: 'public/images/race-dad',
  },
  ai: {
    label: 'AI blog',
    dir: 'ai',
    url: (slug) => `https://ai.whitespacedesign.ca/blog/${slug}`,
    buildDir: 'blog',
    numbered: false,
    types: ['post'],
    defaultType: 'post',
    required: ['title', 'date', 'type', 'excerpt', 'tags'],
    requiredByType: {},
    optional: ['image', 'author'],
    imageDir: 'public/images/ai',
  },
  joshbyberg: {
    label: 'Josh Byberg guides',
    dir: 'joshbyberg',
    url: (slug) => `https://joshbyberg.com/guides/${slug}`,
    buildDir: 'guides',
    numbered: false,
    types: ['post'],
    defaultType: 'post',
    required: ['title', 'date', 'type', 'excerpt', 'tags'],
    requiredByType: {},
    optional: ['image', 'author'],
    imageDir: 'public/images/joshbyberg',
  },
  tracks: {
    label: 'Track guide (racedad.ca)',
    dir: 'tracks',
    url: (slug) => `https://racedad.ca/tracks/${slug}`,
    buildDir: 'race-dad/tracks',
    numbered: false,
    types: [],
    defaultType: null,
    required: ['title', 'location', 'summary'],
    requiredByType: {},
    // relatedTags is optional but wanted: empty means the track page lists no
    // posts, which the checker warns about rather than failing on.
    optional: ['relatedTags', 'website', 'websiteLabel', 'image', 'imageAlt'],
    imageDir: 'public/images/race-dad/tracks',
  },
}

// Authoring flags that take a value. new-post.mjs parses with this, and
// publish-post.mjs needs the same table to know whether a flag it is forwarding
// consumes the next argument — two copies drifted apart is how a title ends up
// swallowed by a flag, so there is one copy and it lives here.
export const FLAGS_WITH_VALUE = new Set([
  'slug', 'date', 'type', 'tags', 'excerpt', 'image', 'video', 'author',
  'client', 'deliverable', 'trim', 'colour', 'location', 'summary',
  'website', 'website-label', 'image-alt', 'related-tags', 'body-file',
])

export const COLLECTION_NAMES = Object.keys(COLLECTIONS)

export function getCollection(name) {
  const collection = COLLECTIONS[name]
  if (!collection) {
    throw new Error(
      `Unknown collection "${name}". Valid: ${COLLECTION_NAMES.join(', ')}`
    )
  }
  return collection
}

export function collectionDir(name) {
  return path.join(CONTENT_ROOT, getCollection(name).dir)
}

// Mirrors filenameToSlug in src/lib/posts.js. Keep the two in step.
export function filenameToSlug(filename) {
  return filename.replace(/\.md$/, '').replace(/^\d+-/, '')
}

export function slugify(text) {
  return String(text)
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/['\u2019]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function todayISO() {
  const now = new Date()
  const pad = (n) => String(n).padStart(2, '0')
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`
}

export const DATE_RE = /^\d{4}-\d{2}-\d{2}$/

// Fields whose value is a site-absolute path into public/.
export const LOCAL_PATH_FIELDS = ['image']
