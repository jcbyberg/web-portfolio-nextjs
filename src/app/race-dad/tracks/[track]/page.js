import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getAllPosts, getTrack, getTrackSlugs } from '@/lib/posts'
import { racedadUrl, RACEDAD_ORIGIN } from '@/lib/seo'

export function generateStaticParams() {
  return getTrackSlugs().map((track) => ({ track }))
}

export async function generateMetadata({ params }) {
  const track = await getTrack(params.track).catch(() => null)
  if (!track) return {}
  const url = racedadUrl(`tracks/${track.slug}`)
  return {
    title: track.title,
    description: track.summary,
    alternates: { canonical: url },
    openGraph: {
      type: 'website',
      url,
      siteName: 'Race Dad',
      title: track.title,
      description: track.summary,
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

// Match a track's relatedTags against post tags case-insensitively. Posts are
// already date DESC (from getAllPosts), and the filter preserves that order.
function relatedPosts(track) {
  const posts = getAllPosts('race-dad')
  return posts.filter((post) =>
    track.relatedTags.some((rt) =>
      post.tags.some((t) => t.toLowerCase() === rt.toLowerCase())
    )
  )
}

export default async function RaceDadTrackPage({ params }) {
  const track = await getTrack(params.track).catch(() => null)
  if (!track) notFound()

  const related = relatedPosts(track)

  return (
    <article className="article">
      <div className="article-head">
        <p className="data">Track &middot; {track.location}</p>
        <h1>{track.title}</h1>
      </div>

      {track.image ? (
        <figure className="track-hero">
          {/* Above the fold and almost certainly this page's Largest
              Contentful Paint, so it loads eagerly (the default) at high
              priority. The 16/9 aspect-ratio in the CSS reserves its space. */}
          <img
            src={track.image}
            alt={track.imageAlt ?? track.title}
            fetchPriority="high"
            decoding="async"
          />
        </figure>
      ) : null}

      <div
        className="article-body"
        dangerouslySetInnerHTML={{ __html: track.contentHtml }}
      />

      {track.website ? (
        <div className="track-callout">
          <p className="data">Official website</p>
          <a href={track.website} target="_blank" rel="noopener noreferrer">
            {track.websiteLabel || track.website} &nbsp;&nearr;
          </a>
        </div>
      ) : null}

      {related.length > 0 ? (
        <section className="year-group">
          <div className="year-head">
            <h2>Related posts</h2>
            <span className="data">
              {related.length} {related.length === 1 ? 'post' : 'posts'}
            </span>
          </div>

          <div className="sheet-head">
            <span className="data">No.</span>
            <span className="data">Post</span>
            <span className="data">Topic</span>
            <span className="data">Date</span>
          </div>

          {related.map((post, i) => (
            <Link
              className="lap"
              href={`/race-dad/${post.slug}`}
              key={post.slug}
            >
              <span className="no">
                {String(related.length - i).padStart(2, '0')}
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
        </section>
      ) : null}

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