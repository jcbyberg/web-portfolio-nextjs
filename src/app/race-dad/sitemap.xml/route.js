import { NextResponse } from 'next/server'
import { getAllPosts, getAllTracks } from '@/lib/posts'
import { RACEDAD_TAGS } from '@/lib/race-dad-tags'
import { racedadUrl } from '@/lib/seo'

export const dynamic = 'force-static'

// The race-dad section is proxied to its own brand domain with the section
// prefix stripped, so this sitemap lists the brand-domain URLs — not the
// joshbyberg.com/race-dad paths.
export function GET() {
  const posts = getAllPosts('race-dad')
  const tracks = getAllTracks()

  const entries = [
    { loc: racedadUrl(), lastmod: null },
    { loc: racedadUrl('about'), lastmod: null },
    ...posts.map((post) => ({ loc: racedadUrl(post.slug), lastmod: post.date })),
    { loc: racedadUrl('tracks'), lastmod: null },
    ...tracks.map((track) => ({
      loc: racedadUrl(`tracks/${track.slug}`),
      lastmod: null,
    })),
    ...RACEDAD_TAGS.map((tag) => ({
      loc: racedadUrl(`tags/${tag.slug}`),
      lastmod: null,
    })),
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