import Link from 'next/link'
import { racedadUrl, RACEDAD_ORIGIN } from '@/lib/seo'

const description =
  'Josh Byberg, aka Race Dad — following his kid through Canadian minimoto and supermoto racing.'

export const metadata = {
  title: 'About',
  description,
  alternates: { canonical: racedadUrl('about') },
  openGraph: {
    type: 'website',
    url: racedadUrl('about'),
    siteName: 'Race Dad',
    title: 'About',
    description,
    locale: 'en_CA',
    images: [
      {
        url: `${RACEDAD_ORIGIN}/images/og-image.png`,
        width: 1200,
        height: 630,
        alt: 'Race Dad',
      },
    ],
  },
}

export default function RaceDadAboutPage() {
  return (
    <article className="article">
      <div className="article-head">
        <p className="data">About</p>
        <h1>I carry the snacks</h1>
      </div>

      <div className="article-body">
        <p>
          I&apos;m Josh Byberg, dad to Abel, Crosby and Cohen. Abel races number 17
          in the Ohvale 160 class, which means most of my summer happens in a
          paddock at Shannonville or Lombardy with a pop-up canopy and a tire gauge.
        </p>
        <p>
          Jamie is the real technician and crew chief. I&apos;m the sponsor, the
          chauffeur, the guy on the wall with the board, and apparently the one who
          writes it all down.
        </p>
        <p>
          This blog is the honest version of youth road racing in Canada: what a
          season actually costs, what the tracks are like from the fence, how the
          pathway works from a parking lot in Brechin all the way to the World
          Finals, and what it feels like to watch your kid go through turn one for
          the first time. It&apos;s also about the people &mdash; a tight-knit group
          of motorcycle enthusiasts who lend you a tire warmer and a spare lever
          without being asked.
        </p>
        <p>
          Off the bike I run a web design and digital marketing practice. If you
          found this because you&apos;re getting a kid into racing &mdash; welcome,
          come say hi at the track.
        </p>
      </div>

      <section className="cta">
        <p className="data">Off the bike, this is my day job</p>
        <h2>Need a website, or help with your socials?</h2>
        <p>
          I do web design, social media and print for small businesses, race schools
          and series organizers across Ontario.
        </p>
        <Link className="btn" href="/bring-your-idea-to-life">
          Bring Your Idea to Life
        </Link>
      </section>
    </article>
  )
}
