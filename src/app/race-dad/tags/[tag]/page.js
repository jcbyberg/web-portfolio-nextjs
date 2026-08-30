import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getAllPosts } from '@/lib/posts'
import { RACEDAD_TAGS, tagToSlug } from '@/lib/race-dad-tags'
import { racedadUrl, RACEDAD_ORIGIN } from '@/lib/seo'

export function generateStaticParams() {
  return RACEDAD_TAGS.map((t) => ({ tag: t.slug }))
}

export function generateMetadata({ params }) {
  const hub = RACEDAD_TAGS.find((t) => t.slug === params.tag)
  if (!hub) return {}
  const url = racedadUrl(`tags/${hub.slug}`)
  return {
    title: hub.label,
    description: hub.description,
    alternates: { canonical: url },
    openGraph: {
      type: 'website',
      url,
      siteName: 'Race Dad',
      title: hub.label,
      description: hub.description,
      locale: 'en_CA',
      images: [
        {
          url: `${RACEDAD_ORIGIN}/images/race-dad/brand/og-race-dad.png`,
          width: 1200,
          height: 630,
          alt: 'Race Dad',
        },
      ],
    },
  }
}

export default function RaceDadTagPage({ params }) {
  const hub = RACEDAD_TAGS.find((t) => t.slug === params.tag)
  if (!hub) notFound()

  const posts = getAllPosts('race-dad').filter((post) =>
    post.tags.some((t) => tagToSlug(t) === hub.slug)
  )

  return (
    <article className="article">
      <div className="article-head">
        <p className="data">Tag</p>
        <h1>{hub.label}</h1>
      </div>

      <div className="article-body">
        <p>{hub.description}</p>
      </div>

      <div className="year-group">
        <div className="sheet-head">
          <span className="data">No.</span>
          <span className="data">Post</span>
          <span className="data">Topic</span>
          <span className="data">Date</span>
        </div>

        {posts.map((post, i) => (
          <Link
            className="lap"
            href={`/race-dad/${post.slug}`}
            key={post.slug}
          >
            <span className="no">
              {String(posts.length - i).padStart(2, '0')}
            </span>
            <h2>{post.title}</h2>
            <div className="tags">
              {post.tags.slice(0, 2).map((t) => (
                <span key={t}>{t}</span>
              ))}
            </div>
            <span className="when data">{post.date}</span>
          </Link>
        ))}
      </div>

      <section className="cta">
        <p className="data">Off the bike, this is my day job</p>
        <h2>I build websites for people in the paddock</h2>
        <p>
          Web design, social media and print for small businesses, race schools and
          series organizers across Ontario.
        </p>
        <Link className="btn" href="/bring-your-idea-to-life">
          Bring Your Idea to Life
        </Link>
      </section>
    </article>
  )
}