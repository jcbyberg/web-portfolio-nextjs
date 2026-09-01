import Image from 'next/image'
import Link from 'next/link'
import { racedadUrl, RACEDAD_ORIGIN } from '@/lib/seo'

// NOTE: this route lives at /race-dad/crosby, sharing the same URL namespace
// as blog posts served by src/app/race-dad/[slug]/page.js. Next.js resolves
// a static segment before a dynamic one, so this page wins today — but a
// future post slugged "crosby" would be silently shadowed by this file and
// would need a different slug instead.

// There is no photo of Crosby and no post about him yet, so this page is
// number-led. The action photo below is his own; no borrowed sibling photo, no generated
// stand-in. It does not claim series results or class membership, because
// neither is established for him. The .rider-hero component is built to
// work with or without a photo; this page is the case with none.

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
          There&apos;s no post about him here yet &mdash; when there is,
          it&apos;ll be added to the timing sheet like everything else.
        </p>
      </div>

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
