import Image from 'next/image'
import Link from 'next/link'
import { racedadUrl, RACEDAD_ORIGIN } from '@/lib/seo'

// NOTE: this route lives at /race-dad/cohen, sharing the same URL namespace
// as blog posts served by src/app/race-dad/[slug]/page.js. Next.js resolves
// a static segment before a dynamic one, so this page wins today — but a
// future post slugged "cohen" would be silently shadowed by this file and
// would need a different slug instead.

const description =
  "Cohen Byberg races #27 in FIM MotoMini Canada's 190cc class — a rookie season that has already put him fourth in the championship."

export const metadata = {
  title: 'Cohen Byberg — #27',
  description,
  alternates: { canonical: racedadUrl('cohen') },
  openGraph: {
    type: 'profile',
    url: racedadUrl('cohen'),
    siteName: 'Race Dad',
    title: 'Cohen Byberg — #27',
    description,
    locale: 'en_CA',
    images: [
      {
        url: `${RACEDAD_ORIGIN}/images/race-dad/cohen/cohen-hero.jpg`,
        width: 2000,
        height: 1125,
        alt: "Cohen Byberg on track in Honda leathers, leading another rider",
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Cohen Byberg — #27',
    description,
    images: [
      `${RACEDAD_ORIGIN}/images/race-dad/cohen/cohen-hero.jpg`,
    ],
  },
}

export default function CohenRiderPage() {
  return (
    <article className="article">
      <section className="rider-hero">
        <div className="rider-plate" aria-hidden="true">
          27
        </div>
        <div className="rider-id">
          <p className="data">FIM MotoMini Canada &middot; 190cc</p>
          <h1>Cohen Byberg</h1>
          <p className="rider-tagline">
            Rookie season in the 190cc class, running #27 &mdash; already
            standing on the podium at Shannonville.
          </p>
        </div>
        <Image
          className="rider-photo"
          src="/images/whitespace/motomini-rider-cards/rider-card-190-cohen-byberg.jpg"
          alt="Cohen Byberg's FIM MotoMini Canada 190cc rider card, number 27, red card in Honda leathers with Shannonville Motorsport Park and Road to MotoGP branding"
          width={1356}
          height={1329}
        />
      </section>

      {/* The rider actually riding. Deliberately not the rider card:
          a card is a graphic about him, this is him. */}
      <figure className="rider-action">
        <Image
          src="/images/race-dad/cohen/cohen-hero.jpg"
          alt="Cohen in his Honda leathers leading another rider through a corner, an FIM banner on the far side of the track."
          width={2000}
          height={1125}
          sizes="(max-width: 48rem) 100vw, 46rem"
          priority
        />
        <figcaption>On track, carrying #27</figcaption>
      </figure>

      <div className="rider-sheet">
        <div className="fact">
          <span className="k">Number</span>
          <span className="v">27</span>
        </div>
        <div className="fact">
          <span className="k">Class</span>
          <span className="v">190cc</span>
        </div>
        <div className="fact">
          <span className="k">Series</span>
          <span className="v">FIM MotoMini Canada</span>
        </div>
      </div>

      <div className="article-body">
        <p>
          Cohen&apos;s rookie season in the Ohvale 190 class has already put
          him fourth in the championship. At round three at Shannonville, he
          finished third in both races &mdash; behind Stefan Tanasic, who won
          both, and Eric Sergi, who was second in both.
        </p>
        <p>
          At Lombardy, on a circuit he had seen for the first time the day
          before, he finished fourth in the class in race two.
        </p>
      </div>

      <nav className="rider-sources" aria-label="Race reports about Cohen">
        <span className="data">Read the race reports</span>
        <ul>
          <li>
            <Link href="/race-dad/shannonville-round-three">
              Two Podiums in a Weekend &mdash; Shannonville round three
            </Link>
          </li>
          <li>
            <Link href="/race-dad/lombardy-two-visits">
              Two Trips to Lombardy
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
