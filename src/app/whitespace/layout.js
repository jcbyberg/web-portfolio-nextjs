import { wsDisplay, wsBody, wsMono } from '@/app/fonts'
import Link from 'next/link'
import './whitespace.css'
import Punct from '@/app/whitespace/punct'




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
            <Punct>joshbyberg.com</Punct>
          </span>
        </footer>
      </div>
    </div>
  )
}
