import { NextResponse } from 'next/server'
import { getAllPosts } from '@/lib/posts'
import { whitespaceUrl } from '@/lib/seo'

export const dynamic = 'force-static'

// The whitespace section is proxied to its own brand domain with the section
// prefix stripped, so this sitemap lists the brand-domain URLs — not the
// joshbyberg.com/whitespace paths.
export function GET() {
  const posts = getAllPosts('whitespace')

  const entries = [
    { loc: whitespaceUrl(), lastmod: null },
    { loc: whitespaceUrl('about'), lastmod: null },
    ...posts.map((post) => ({ loc: whitespaceUrl(post.slug), lastmod: post.date })),
  ]

  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...entries.map(
      ({ loc, lastmod }) =>
        `  <url>\n    <loc>${loc}</loc>` +
        (lastmod ? `\n    <lastmod>${lastmod}</lastmod>` : '') +
        `\n  </url>`
    ),
    '</urlset>',
  ].join('\n')

  return new NextResponse(xml, {
    headers: { 'Content-Type': 'application/xml' },
  })
}