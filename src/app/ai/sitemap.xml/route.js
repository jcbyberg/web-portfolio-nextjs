import { NextResponse } from 'next/server'
import { aiUrl } from '@/lib/seo'

export const dynamic = 'force-static'

// The AI section is proxied onto ai.whitespacedesign.ca with the /ai prefix
// stripped, so this sitemap lists subdomain URLs — not the /ai paths this app
// serves them from. One page today; the array is the seam for the case-study
// pages if they ever get written.
export function GET() {
  const entries = [{ loc: aiUrl(), lastmod: null }]

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
