import { getAllPosts } from '@/lib/posts'

const siteUrl = 'https://joshbyberg.com'

const BRAND_ROUTES = [
  { brand: 'ai', path: '/blog' },
]

// Only the "ai" brand still lives on this domain. The whitespace and race-dad
// sections are proxied to their own brand domains (whitespacedesign.ca and
// racedad.ca, respectively), which list their own URLs in per-brand sitemaps —
// so this hub sitemap must not claim them. The landing page and the /blog
// section are the real routes here; the rest of the site remains a single page
// whose sections live at "/".
export default function sitemap() {
  const entries = [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1,
    },
    {
      url: `${siteUrl}/oshawa`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${siteUrl}/bring-your-idea-to-life`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.9,
    },
  ]

  for (const { brand, path } of BRAND_ROUTES) {
    entries.push({
      url: `${siteUrl}${path}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    })

    const posts = getAllPosts(brand)
    for (const post of posts) {
      entries.push({
        url: `${siteUrl}${path}/${post.slug}`,
        lastModified: post.date ? new Date(post.date) : new Date(),
        changeFrequency: 'monthly',
        priority: 0.6,
      })
    }
  }

  return entries
}
