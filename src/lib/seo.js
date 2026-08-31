// The brand domains are the canonical home of the whitespace and race-dad
// content. Two Cloudflare Workers proxy this Next site onto those domains and,
// crucially, STRIP the section prefix in the process:
//
//   joshbyberg.com/whitespace/foo  ->  https://whitespacedesign.ca/foo
//   joshbyberg.com/race-dad/foo    ->  https://racedad.ca/foo
//
// Because the prefix is stripped, canonical URLs on the brand domains must be
// built from the bare slug — never from the on-site path. Passing a prefixed
// path such as "/whitespace/foo" here would point every canonical at a URL the
// brand domain does not serve (a 404). Callers pass the bare slug.

export const WHITESPACE_ORIGIN = 'https://whitespacedesign.ca'
export const RACEDAD_ORIGIN = 'https://racedad.ca'

// The AI arm is a SUBDOMAIN, not a prefix-stripped brand domain, but its worker
// strips /ai the same way, so the same bare-slug rule applies to its canonicals.
export const AI_ORIGIN = 'https://ai.whitespacedesign.ca'

// '' -> 'https://whitespacedesign.ca/'
export function whitespaceUrl(slug = '') {
  return slug ? `${WHITESPACE_ORIGIN}/${slug}` : `${WHITESPACE_ORIGIN}/`
}

// 'x' -> 'https://racedad.ca/x'
export function racedadUrl(slug = '') {
  return slug ? `${RACEDAD_ORIGIN}/${slug}` : `${RACEDAD_ORIGIN}/`
}

// '' -> 'https://ai.whitespacedesign.ca/'
export function aiUrl(slug = '') {
  return slug ? `${AI_ORIGIN}/${slug}` : `${AI_ORIGIN}/`
}

// ---------------------------------------------------------------------------
// Post images
//
// A post's hero image comes from the `image` frontmatter key or, when that is
// absent, the first <img> in its rendered body. One shared selection so the two
// brands never disagree about which image represents a post.
// ---------------------------------------------------------------------------

export function postImageSource(post) {
  if (post?.image) return post.image
  if (post?.contentHtml) {
    const match = /<img[^>]+src=["']([^"']+)["']/.exec(post.contentHtml)
    if (match) return match[1]
  }
  return null
}

// Resolve a root-relative image path ("/images/whitespace/foo.jpg") into an
// absolute URL on a brand origin. Already-absolute URLs pass through unchanged.
export function absoluteUrl(path, origin) {
  if (!path) return null
  if (/^https?:\/\//i.test(path)) return path
  return `${origin}${path.startsWith('/') ? '' : '/'}${path}`
}

export function postImageUrl(post, origin) {
  return absoluteUrl(postImageSource(post), origin)
}

// -> an Open Graph images array, or undefined when the post has no image (so
// the site default applies instead of emitting a broken URL).
export function postOpenGraphImage(post, origin) {
  const url = postImageUrl(post, origin)
  if (!url) return undefined
  return [{ url, alt: post.title }]
}

// ---------------------------------------------------------------------------
// Structured data (JSON-LD) builders
// ---------------------------------------------------------------------------

const BRAND_ORIGINS = [WHITESPACE_ORIGIN, RACEDAD_ORIGIN, AI_ORIGIN]

// Per-brand Organization. The explicit `@id` keeps it distinct from the root
// layout's ProfessionalService (which carries its own @id) even when both render
// on the same page. `sameAs` lists the OTHER brand domains and joshbyberg.com so
// crawlers read the properties as one operator's.
//
// The siblings are derived from BRAND_ORIGINS rather than passed in per caller.
// They used to be passed, and each caller named exactly one — so whitespace and
// race-dad both claimed each other and neither claimed the AI subdomain, which
// silently withheld the structured-data half of the link graph from the newest
// and weakest property. Deriving it means adding a fourth brand updates all
// three schemas at once instead of depending on three call sites agreeing.
export function organizationSchema({ origin, name }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${origin}/#organization`,
    name,
    url: origin,
    sameAs: [
      ...BRAND_ORIGINS.filter((o) => o !== origin),
      'https://joshbyberg.com',
    ],
  }
}

export function blogSchema({ origin, name, description, postSlugs = [] }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    '@id': `${origin}/#blog`,
    name,
    url: origin,
    description,
    publisher: { '@id': `${origin}/#organization` },
    blogPost: postSlugs.map((slug) => `${origin}/${slug}`),
  }
}

export function blogPostingSchema({
  url,
  headline,
  description,
  datePublished,
  image,
  organizationId,
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline,
    ...(description ? { description } : {}),
    ...(datePublished ? { datePublished } : {}),
    author: {
      '@type': 'Person',
      name: 'Josh Byberg',
    },
    publisher: { '@id': organizationId },
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    ...(image ? { image } : {}),
  }
}

export function breadcrumbSchema(items) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      ...(item.url ? { item: item.url } : {}),
    })),
  }
}

// A services page needs a Service entity to be eligible for service-intent
// results; the blog-shaped schemas above do not cover it. `areaServed` is what
// ties the page to the local market it is actually selling into.
export function serviceSchema({ origin, name, description, serviceType, areaServed = [] }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    '@id': `${origin}/#service`,
    name,
    description,
    serviceType,
    provider: { '@id': `${origin}/#organization` },
    ...(areaServed.length
      ? { areaServed: areaServed.map((n) => ({ '@type': 'Place', name: n })) }
      : {}),
  }
}
