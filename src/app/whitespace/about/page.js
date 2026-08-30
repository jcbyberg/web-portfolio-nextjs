import Link from 'next/link'
import { whitespaceUrl, WHITESPACE_ORIGIN } from '@/lib/seo'

export const metadata = {
  title: 'About',
  alternates: { canonical: whitespaceUrl('about') },
  openGraph: {
    type: 'website',
    url: whitespaceUrl('about'),
    siteName: 'Whitespace Designs',
    title: 'About',
    locale: 'en_CA',
    images: [
      {
        url: `${WHITESPACE_ORIGIN}/images/og-image.png`,
        width: 1200,
        height: 630,
        alt: 'Whitespace Designs',
      },
    ],
  },
}

export default function WhitespaceAboutPage() {
  return (
    <section className="article">
      <div className="article-head">
        <p className="spec">About</p>
        <h1>Design that has to work at a glance.</h1>
      </div>

      <div className="article-body">
        <p>
          I&rsquo;m Josh Byberg. I run a small design and web practice out of Ontario,
          and most of what I make gets printed, hung in a hall, or handed to somebody
          who is already walking away.
        </p>
        <p>
          That constraint shapes everything. A brochure competes with a phone. A booth
          banner competes with forty other booths. A promo card has about a second and
          a half to get somebody to scan a QR code. None of that is solved by making
          something pretty &mdash; it&rsquo;s solved by deciding what the piece is
          actually for and cutting everything that doesn&rsquo;t serve it.
        </p>
        <p>
          This journal is where I show the work with its specs attached: trim size,
          colour, what the constraint was and what I did about it. Less portfolio, more
          working notes.
        </p>
      </div>

      <section className="cta">
        <p className="spec">Available for work</p>
        <h2>Let&rsquo;s build something worth handing to someone.</h2>
        <p>
          Web design, print, trade show graphics and social media for small businesses
          and racing programs.
        </p>
        <Link className="btn" href="/bring-your-idea-to-life">
          Bring Your Idea to Life
        </Link>
      </section>
    </section>
  )
}
