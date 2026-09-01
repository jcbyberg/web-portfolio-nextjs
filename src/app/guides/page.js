import Link from 'next/link'
import { getAllPosts } from '@/lib/posts'
import { JOSHBYBERG_ORIGIN } from '@/lib/seo'

const siteUrl = JOSHBYBERG_ORIGIN

export const metadata = {
  title: 'Guides for Local Businesses',
  alternates: { canonical: `${siteUrl}/guides` },
}

function formatDate(iso) {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString('en-CA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  })
}

export default function GuidesIndexPage() {
  const posts = getAllPosts('joshbyberg')

  return (
    <div className="guides-shell">
      <section className="guides-hero">
        <p className="guides-kicker">Straight answers for local businesses</p>
        <h1>Make your website earn its place on the payroll.</h1>
        <p>
          Practical notes for trades and service businesses in Oshawa, Whitby,
          and across Durham Region. No trends to chase—just clearer decisions
          about the site your customers actually use.
        </p>
      </section>

      <section className="guides-list" aria-labelledby="latest-guides">
        <div className="guides-list-heading">
          <h2 id="latest-guides">Latest guides</h2>
          <span>{posts.length} {posts.length === 1 ? 'guide' : 'guides'}</span>
        </div>

        {posts.length ? (
          posts.map((post) => (
            <Link className="guides-card" href={`/guides/${post.slug}`} key={post.slug}>
              <div>
                <p className="guides-date">{formatDate(post.date)}</p>
                <h2>{post.title}</h2>
                <p>{post.excerpt}</p>
              </div>
              <span className="guides-read">Read guide <span aria-hidden="true">→</span></span>
            </Link>
          ))
        ) : (
          <p className="guides-empty">The first guide is coming soon.</p>
        )}
      </section>
    </div>
  )
}
