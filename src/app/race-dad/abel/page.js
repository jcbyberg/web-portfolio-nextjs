import Image from 'next/image'
import Link from 'next/link'
import { racedadUrl, RACEDAD_ORIGIN } from '@/lib/seo'

// NOTE: this route lives at /race-dad/abel, sharing the same URL namespace
// as blog posts served by src/app/race-dad/[slug]/page.js. Next.js resolves
// a static segment before a dynamic one, so this page wins today — but a
// future post slugged "abel" would be silently shadowed by this file and
// would need a different slug instead.

const description =
  'Abel Byberg races #17 in FIM MotoMini Canada’s 160cc class — the kid who learned to use a clutch for the first time on a Super Sonic Road Race School Kawasaki.'

export const metadata = {
  title: 'Abel Byberg — #17',
  description,
  alternates: { canonical: racedadUrl('abel') },
  openGraph: {
    type: 'profile',
    url: racedadUrl('abel'),
    siteName: 'Race Dad',
    title: 'Abel Byberg — #17',
    description,
    locale: 'en_CA',
    images: [
      {
        url: `${RACEDAD_ORIGIN}/images/race-dad/abel/abel-hero.jpg`,
        width: 2000,
        height: 1125,
        alt: "Abel Byberg riding a green Kawasaki KLX at a kart circuit",
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Abel Byberg — #17',
    description,
    images: [
      `${RACEDAD_ORIGIN}/images/race-dad/abel/abel-hero.jpg`,
    ],
  },
}

export default function AbelRiderPage() {
  return (
    <article className="article">
      <section className="rider-hero">
        <div className="rider-plate" aria-hidden="true">
          17
        </div>
        <div className="rider-id">
          <p className="data">FIM MotoMini Canada &middot; 160cc</p>
          <h1>Abel Byberg</h1>
          <p className="rider-tagline">
            Running #17 in the 160cc class &mdash; and the rider in one of
            the shortest clips on this site: the first time he ever used a
            clutch.
          </p>
        </div>
        <Image
          className="rider-photo"
          src="/images/whitespace/motomini-rider-cards/rider-card-160-abel-byberg.jpg"
          alt="Abel Byberg's FIM MotoMini Canada 160cc rider card, number 17, blue card in Ohvale leathers with a Super Sonic Road Race School cap"
          width={1356}
          height={1329}
        />
      </section>

      {/* The rider actually riding. Deliberately not the rider card:
          a card is a graphic about him, this is him. */}
      <figure className="rider-action">
        <Image
          src="/images/race-dad/abel/abel-hero.jpg"
          alt="Abel on a green Kawasaki KLX at a kart circuit, in red and black leathers and helmet, with red-and-white kerbing behind him."
          width={2000}
          height={1125}
          sizes="(max-width: 48rem) 100vw, 46rem"
          priority
        />
        <figcaption>Super Sonic Road Race School day</figcaption>
      </figure>

      <div className="rider-sheet">
        <div className="fact">
          <span className="k">Number</span>
          <span className="v">17</span>
        </div>
        <div className="fact">
          <span className="k">Class</span>
          <span className="v">160cc</span>
        </div>
        <div className="fact">
          <span className="k">Series</span>
          <span className="v">FIM MotoMini Canada</span>
        </div>
      </div>

      <div className="article-body">
        <p>
          At a Super Sonic Road Race School day, Abel used a clutch for the
          first time &mdash; on a borrowed Kawasaki, working out the friction
          zone the way every rider does: badly, over and over, until he
          didn&apos;t.
        </p>
      </div>

      <nav className="rider-sources" aria-label="Posts about Abel">
        <span className="data">Read the post</span>
        <ul>
          <li>
            <Link href="/race-dad/first-clutch">
              The First Time Abel Used a Clutch
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
