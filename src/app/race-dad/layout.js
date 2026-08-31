import './race-dad.css'
import Link from 'next/link'
import Image from 'next/image'
import { rdDisplay, rdBody, rdMono } from '@/app/fonts'
import {
  RACEDAD_ORIGIN,
  WHITESPACE_ORIGIN,
  AI_ORIGIN,
  organizationSchema,
} from '@/lib/seo'

const rdTitle = 'Race Dad — Canadian minimoto from the pit wall'
const rdDescription =
  'A dad following his kids through Canadian minimoto and supermoto racing — Ohvale, MiniSBK, FIM MotoMini Canada.'

export const metadata = {
  title: {
    default: rdTitle,
    template: '%s | Race Dad',
  },
  description: rdDescription,
  openGraph: {
    type: 'website',
    url: `${RACEDAD_ORIGIN}/`,
    siteName: 'Race Dad',
    title: rdTitle,
    description: rdDescription,
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
  twitter: {
    card: 'summary_large_image',
    title: rdTitle,
    description: rdDescription,
    images: [`${RACEDAD_ORIGIN}/images/race-dad/brand/og-race-dad.png`],
  },
}

const rdOrganization = organizationSchema({
  origin: RACEDAD_ORIGIN,
  name: 'Race Dad',
})

export default function RaceDadLayout({ children }) {
  return (
    <div
      className={`rd-root ${rdDisplay.variable} ${rdBody.variable} ${rdMono.variable}`}
    >
      <div className="wrap">
        <header className="masthead">
          <Link className="wordmark" href="/race-dad">
            <span className="plate" aria-hidden="true">
              RD
            </span>
            <b>Race Dad</b>
          </Link>
          <nav>
            <Link href="/race-dad">Posts</Link>
            <Link href="/race-dad/about">About</Link>
            <Link href="/bring-your-idea-to-life">Bring Your Idea to Life</Link>
          </nav>
        </header>

        <main>{children}</main>

        <footer className="site">
          <Image
            className="footer-mark"
            src="/images/race-dad/brand/race-dad-logo.png"
            alt="Race Dad"
            width={273}
            height={351}
          />
          <span className="data">Race Dad &mdash; Josh Byberg &middot; Ontario</span>
          <span className="data"><a href={WHITESPACE_ORIGIN}>Whitespace Design</a></span>
          <span className="data"><a href={AI_ORIGIN}>Whitespace AI</a></span>
          <span className="data">Abel &middot; Crosby &middot; Cohen</span>
        </footer>

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(rdOrganization) }}
        />
      </div>
    </div>
  )
}
