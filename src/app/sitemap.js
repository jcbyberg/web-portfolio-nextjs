const siteUrl = 'https://joshbyberg.com'

// NO brand section lives on this domain any more. whitespace and race-dad are
// proxied to whitespacedesign.ca and racedad.ca; the AI blog moved to
// ai.whitespacedesign.ca on 2026-08-30 and joshbyberg.com/blog/* now 301s there.
// Each brand lists its own URLs in its own sitemap, so this hub must claim none
// of them — a sitemap entry for a URL that 301s away is a contradiction a
// crawler has to resolve, and it resolves it by trusting the sitemap less.
//
// What remains here is the landing page and the two pages that genuinely live
// on this domain.
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

  return entries
}
