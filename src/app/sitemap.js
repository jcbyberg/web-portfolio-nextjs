const siteUrl = 'https://joshbyberg.com'

// Single-page site: the section anchors live on "/", so one canonical entry is
// the honest sitemap. Add real routes here if pages are ever split out.
export default function sitemap() {
  return [
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
  ]
}
