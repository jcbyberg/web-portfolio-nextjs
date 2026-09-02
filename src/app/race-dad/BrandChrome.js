'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { WHITESPACE_ORIGIN, AI_ORIGIN } from '@/lib/seo'

// The Big Berg Racing team page carries the team's own identity rather than
// the Race Dad masthead — it is the boys' page, not the blog's. Everything
// else in /race-dad keeps the Race Dad chrome. Only the branding swaps; the
// navigation is identical on both so the page is not a dead end.
const TEAM_PATH = '/race-dad/big-berg-racing'

// Match on the trailing segment, NOT on the full path. The Cloudflare worker
// strips the /race-dad prefix when it serves racedad.ca (see src/lib/seo.js),
// so this component renders on the server at /race-dad/big-berg-racing and
// then hydrates in the browser at /big-berg-racing. Comparing the whole path
// is false on the live domain: the branding would flip back to Race Dad on
// hydration, with a mismatch on the way through.
function isTeamPage(pathname) {
  return pathname === TEAM_PATH || pathname === '/big-berg-racing'
}

export function Masthead() {
  const isTeam = isTeamPage(usePathname())

  return (
    <header className="masthead">
      {isTeam ? (
        <Link className="wordmark bbr-wordmark" href={TEAM_PATH}>
          {/* The horizontal badge, not the stacked lockup: at masthead size a
              three-line stack collapses into an unreadable smudge, where the
              two-line badge still holds its counters. It already reads
              "Big Berg Racing", so no text mark sits beside it. */}
          <Image
            src="/images/race-dad/big-berg-racing/bbr-badge.png"
            alt="Big Berg Racing"
            width={595}
            height={294}
            sizes="5rem"
            priority
          />
        </Link>
      ) : (
        <Link className="wordmark" href="/race-dad">
          <span className="plate" aria-hidden="true">
            RD
          </span>
          <b>Race Dad</b>
        </Link>
      )}
      <nav>
        <Link href="/race-dad">Posts</Link>
        <Link href="/race-dad/about">About</Link>
        <a href={AI_ORIGIN}>Automation</a>
        <Link href="/bring-your-idea-to-life">Bring Your Idea to Life</Link>
      </nav>
    </header>
  )
}

export function SiteFooter() {
  const isTeam = isTeamPage(usePathname())

  return (
    <footer className="site">
      {isTeam ? (
        <span className="data">Big Berg Racing &middot; Ontario</span>
      ) : (
        <>
          <Image
            className="footer-mark"
            src="/images/race-dad/brand/race-dad-logo.png"
            alt="Race Dad"
            width={273}
            height={351}
          />
          <span className="data">
            Race Dad &mdash; Josh Byberg &middot; Ontario
          </span>
        </>
      )}
      <span className="data">
        <a href={WHITESPACE_ORIGIN}>Whitespace Design</a>
      </span>
      <span className="data">
        <a href={AI_ORIGIN}>Whitespace AI</a>
      </span>
      <span className="data">Abel &middot; Crosby &middot; Cohen</span>
    </footer>
  )
}
