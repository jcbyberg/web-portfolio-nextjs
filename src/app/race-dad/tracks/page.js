import Link from 'next/link'
import { getAllTracks } from '@/lib/posts'
import { racedadUrl, RACEDAD_ORIGIN } from '@/lib/seo'

const description =
  'The circuits the Race Dad family rides — Canadian minimoto and supermoto tracks, from a grassroots go-kart lot to full road courses.'

export const metadata = {
  title: 'Tracks',
  description,
  alternates: { canonical: racedadUrl('tracks') },
  openGraph: {
    type: 'website',
    url: racedadUrl('tracks'),
    siteName: 'Race Dad',
    title: 'Tracks',
    description,
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

export default function RaceDadTracksIndexPage() {
  const tracks = getAllTracks()

  return (
    <>
      <div className="directory-head">
        <p className="data">The paddock map</p>
        <h1>The tracks</h1>
        <p>
          The circuits that shape our calendar — from the cones at Brechin and
          the infield at Mosport to the full course at Shannonville and the
          supermoto venues further afield.
        </p>
      </div>

      <div className="track-grid">
        {tracks.map((track) => (
          <Link
            className="track-card"
            href={`/race-dad/tracks/${track.slug}`}
            key={track.slug}
          >
            {track.image ? (
              // These cards are rendered by this component rather than through
              // the markdown pipeline, so the img transform in lib/posts.js
              // does not reach them. Space is already reserved by the
              // aspect-ratio in the CSS, so what is left to add is the loading
              // behaviour: every card here is below the fold.
              <img
                className="track-card-photo"
                src={track.image}
                alt={track.imageAlt ?? track.title}
                loading="lazy"
                decoding="async"
              />
            ) : null}
            <span className="track-location">{track.location}</span>
            <h2>{track.title}</h2>
            <p>{track.summary}</p>
            <span className="track-card-link">View track &nbsp;&rarr;</span>
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
    </>
  )
}