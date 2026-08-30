import { wsDisplay, wsBody, wsMono } from '@/app/fonts'
import Link from 'next/link'
import './whitespace.css'
import Punct from '@/app/whitespace/punct'
import { WHITESPACE_ORIGIN, RACEDAD_ORIGIN, organizationSchema } from '@/lib/seo'

const wsTitle = 'Whitespace Designs — Josh Byberg'
const wsDescription =
  'A design blog by Josh Byberg — print, brand systems and trade show work, shown with the specs.'

export const metadata = {
  title: {
    default: wsTitle,
    absolute: wsTitle,
    template: '%s — Whitespace Designs',
  },
  description: wsDescription,
  openGraph: {
    type: 'website',
    url: `${WHITESPACE_ORIGIN}/`,
    siteName: 'Whitespace Designs',
    title: wsTitle,
    description: wsDescription,
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
  twitter: {
    card: 'summary_large_image',
    title: wsTitle,
    description: wsDescription,
    images: [`${WHITESPACE_ORIGIN}/images/og-image.png`],
  },
}

const wsOrganization = organizationSchema({
  origin: WHITESPACE_ORIGIN,
  name: 'Whitespace Designs',
  otherBrandOrigin: RACEDAD_ORIGIN,
})

export default function WhitespaceLayout({ children }) {
  return (
    <div
      className={`ws-root ${wsDisplay.variable} ${wsBody.variable} ${wsMono.variable}`}
    >
      <div className="sheet-marks" aria-hidden="true">
        <span className="tl"></span>
        <span className="tr"></span>
        <span className="bl"></span>
        <span className="br"></span>
      </div>

      <div className="wrap">
        <header className="masthead">
          <Link className="wordmark" href="/whitespace">
            White<em></em>space Designs
          </Link>
          <nav>
            <Link href="/whitespace">Work</Link>
            <Link href="/whitespace/about">About</Link>
            <Link href="/hire-me">Hire me</Link>
          </nav>
        </header>

        <main>{children}</main>

        <footer className="site">
          <span className="spec">
            <Punct>Whitespace Designs &mdash; Josh Byberg</Punct>
          </span>
          <span className="spec">
            <Punct>
              <a href={RACEDAD_ORIGIN}>Race Dad</a>
            </Punct>
          </span>
          <span className="spec">
            <Punct>joshbyberg.com</Punct>
          </span>
        </footer>

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(wsOrganization) }}
        />
      </div>
    </div>
  )
}
