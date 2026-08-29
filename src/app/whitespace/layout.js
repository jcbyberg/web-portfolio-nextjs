import { Schibsted_Grotesk, Literata, DM_Mono } from 'next/font/google'
import Link from 'next/link'
import './whitespace.css'

const schibstedGrotesk = Schibsted_Grotesk({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--ws-font-display',
  display: 'swap',
})

const literata = Literata({
  subsets: ['latin'],
  weight: ['400', '600'],
  variable: '--ws-font-body',
  display: 'swap',
})

const dmMono = DM_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  style: ['normal'],
  variable: '--ws-font-mono',
  display: 'swap',
})

export const metadata = {
  title: {
    default: 'Whitespace Designs — Josh Byberg',
    absolute: 'Whitespace Designs — Josh Byberg',
    template: '%s — Whitespace Designs',
  },
  description:
    'A design blog by Josh Byberg — print, brand systems and trade show work, shown with the specs.',
}

export default function WhitespaceLayout({ children }) {
  return (
    <div
      className={`ws-root ${schibstedGrotesk.variable} ${literata.variable} ${dmMono.variable}`}
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
          <span className="spec">Whitespace Designs &mdash; Josh Byberg</span>
          <span className="spec">joshbyberg.com</span>
        </footer>
      </div>
    </div>
  )
}
