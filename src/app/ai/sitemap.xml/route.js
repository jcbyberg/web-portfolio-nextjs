import { NextResponse } from 'next/server'
import { getAllPosts } from '@/lib/posts'
import { aiUrl } from '@/lib/seo'

export const dynamic = 'force-static'

// The AI section is proxied onto ai.whitespacedesign.ca with the /ai prefix
// stripped, so this sitemap lists subdomain URLs — not the /ai paths this app
// serves them from.
//
// /blog is the exception: it is passed through at its own path rather than
// under the section prefix, because its Next routes stay at src/app/blog (moving
// them under src/app/ai would nest their .ai-root layout inside .wsai-root).
// So blog URLs keep /blog on this domain too. joshbyberg.com/blog/* 301s here.
export function GET() {
  const posts = getAllPosts('ai')

  const entries = [
    { loc: aiUrl(), lastmod: null },
    { loc: aiUrl('blog'), lastmod: null },
    ...posts.map((post) => ({ loc: aiUrl(`blog/${post.slug}`), lastmod: post.date })),
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
