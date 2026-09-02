import Image from 'next/image'
import Link from 'next/link'
import { racedadUrl, RACEDAD_ORIGIN } from '@/lib/seo'

// NOTE: this route lives at /race-dad/crosby, sharing the same URL namespace
// as blog posts served by src/app/race-dad/[slug]/page.js. Next.js resolves
// a static segment before a dynamic one, so this page wins today — but a
// future post slugged "crosby" would be silently shadowed by this file and
// would need a different slug instead.

// This page is number-led: there is no rider card for Crosby the way there is
// for Abel and Cohen. The action photo below is his own; no borrowed sibling
// photo, no generated stand-in. The .rider-hero component is built to work
// with or without a card, and this page is the case without one.
//
// Every result stated here traces to a race report in src/content/race-dad/
// and is linked from .rider-sources below. Nothing about a child goes on this
// page that is not written up somewhere that says where it came from.

const description =
  'Crosby Byberg, #7 — rides a Honda CRF50 modified for the track.'

export const metadata = {
  title: 'Crosby Byberg — #7',
  description,
  alternates: { canonical: racedadUrl('crosby') },
  openGraph: {
    type: 'profile',
    url: racedadUrl('crosby'),
    siteName: 'Race Dad',
    title: 'Crosby Byberg — #7',
    description,
    locale: 'en_CA',
    images: [
      {
        url: `${RACEDAD_ORIGIN}/images/race-dad/crosby/crosby-hero.jpg`,
        width: 2000,
        height: 1125,
        alt: 'Race Dad',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Crosby Byberg — #7',
    description,
    images: [`${RACEDAD_ORIGIN}/images/race-dad/crosby/crosby-hero.jpg`],
  },
}

export default function CrosbyRiderPage() {
  return (
    <article className="article">
      <section className="rider-hero">
        <div className="rider-plate" aria-hidden="true">
          7
        </div>
        <div className="rider-id">
          <p className="data">Number 7</p>
          <h1>Crosby Byberg</h1>
          <p className="rider-tagline">
            Eight years old, riding a Honda CRF50 modified for the track.
          </p>
        </div>
      </section>

      {/* The rider actually riding. Deliberately not the rider card:
          a card is a graphic about him, this is him. */}
      <figure className="rider-action">
        <Image
          src="/images/race-dad/crosby/crosby-hero.jpg"
          alt="Crosby riding a red Honda CRF50 on a kart circuit, in a white KYT helmet with his face visible through the visor."
          width={2000}
          height={1125}
          sizes="(max-width: 48rem) 100vw, 46rem"
          priority
        />
        <figcaption>On a CRF50</figcaption>
      </figure>

      <div className="rider-sheet">
        <div className="fact">
          <span className="k">Number</span>
          <span className="v">7</span>
        </div>
        <div className="fact">
          <span className="k">Age</span>
          <span className="v">8</span>
        </div>
        <div className="fact">
          <span className="k">Bike</span>
          <span className="v">Honda CRF50</span>
        </div>
      </div>

      <div className="article-body">
        <p>
          Crosby is 8, running #7 on a Honda CRF50 modified for the track.
          He is the youngest of the three and races the smallest bikes, and
          he is the one who most obviously wants the position rather than the
          lap time.
        </p>
        <p>
          The 2026 season gave him a win in the rain at Brechin, second in
          class at the MiniSBK opener at Shannonville, third in the Canadian
          Supermoto opening round, and a race-one win at MiniSBK round four
          before a mechanical ended his second race.
        </p>
      </div>

      <nav className="rider-sources" aria-label="Posts about Crosby">
        <span className="data">Read the posts</span>
        <ul>
          <li>
            <Link href="/race-dad/brechin-season-opener-2026">
              Race Season Started in the Rain at Brechin
            </Link>
          </li>
          <li>
            <Link href="/race-dad/minisbk-opener-shannonville">
              Cohen Wins the Opener at Shannonville
            </Link>
          </li>
          <li>
            <Link href="/race-dad/racing-supermoto-shannonville">
              All Three of Them, Same Race
            </Link>
          </li>
          <li>
            <Link href="/race-dad/minisbk-round-four">
              One Win, One Broken Bike
            </Link>
          </li>
        </ul>
      </nav>

      <section className="cta">
        <p className="data">Off the bike, this is my day job</p>
        <h2>I build websites for people in the paddock</h2>
        <p>
          Web design, social media and print for small businesses, race
          schools and series organizers across Ontario.
        </p>
        <Link className="btn" href="/bring-your-idea-to-life">
          Bring Your Idea to Life
        </Link>
      </section>
    </article>
  )
}
