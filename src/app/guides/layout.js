import Link from 'next/link'
import Image from 'next/image'
import './guides.css'
import { JOSHBYBERG_ORIGIN } from '@/lib/seo'

const siteUrl = JOSHBYBERG_ORIGIN
const guidesDescription =
  'Practical website and digital marketing guides for local trades and service businesses in Durham Region.'

export const metadata = {
  title: {
    default: 'Guides for Local Businesses',
    template: '%s | Josh Byberg',
  },
  description: guidesDescription,
  alternates: { canonical: `${siteUrl}/guides` },
  openGraph: {
    type: 'website',
    url: `${siteUrl}/guides`,
    siteName: 'Josh Byberg',
    title: 'Guides for Local Businesses',
    description: guidesDescription,
    locale: 'en_CA',
    images: [
      {
        url: `${siteUrl}/images/og-image.png`,
        width: 1200,
        height: 630,
        alt: 'Josh Byberg — Web Developer & Graphic Designer',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Guides for Local Businesses',
    description: guidesDescription,
    images: [`${siteUrl}/images/og-image.png`],
  },
}

export default function GuidesLayout({ children }) {
  return (
    <div className="guides-root">
      <header className="guides-header">
        <div className="guides-shell guides-header-inner">
          <Link href="/" className="guides-brand" aria-label="Josh Byberg home">
            <Image
              src="/images/logo.png"
              alt="JB Creative logo"
              width={240}
              height={96}
              priority
            />
          </Link>
          <nav aria-label="Guide navigation">
            <Link href="/guides">Guides</Link>
            <Link href="/oshawa">Oshawa offer</Link>
            <Link className="guides-nav-cta" href="/bring-your-idea-to-life">
              Start a project
            </Link>
          </nav>
        </div>
      </header>

      <main>{children}</main>

      <footer className="guides-footer">
        <div className="guides-shell guides-footer-inner">
          <div>
            <strong>Josh Byberg</strong>
            <p>Web developer and graphic designer in Oshawa, Ontario.</p>
          </div>
          <Link href="/bring-your-idea-to-life">Bring your idea to life</Link>
        </div>
      </footer>
    </div>
  )
}
