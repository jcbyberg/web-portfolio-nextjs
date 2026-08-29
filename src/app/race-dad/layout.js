import './race-dad.css'
import Link from 'next/link'
import { rdDisplay, rdBody, rdMono } from '@/app/fonts'




export const metadata = {
  title: {
    default: 'Race Dad — Canadian minimoto from the pit wall',
    template: '%s | Race Dad',
  },
  description:
    'A dad following his kids through Canadian minimoto and supermoto racing — Ohvale, MiniSBK, FIM MotoMini Canada.',
}

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
          <span className="data">Race Dad &mdash; Josh Byberg &middot; Ontario</span>
          <span className="data">Abel &middot; Crosby &middot; Cohen</span>
        </footer>
      </div>
    </div>
  )
}
