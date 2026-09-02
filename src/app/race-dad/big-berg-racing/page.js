import Image from 'next/image'
import Link from 'next/link'
import { getAllPosts } from '@/lib/posts'
import { racedadUrl, RACEDAD_ORIGIN } from '@/lib/seo'

// NOTE: this route lives at /race-dad/big-berg-racing, sharing the same URL
// namespace as blog posts served by src/app/race-dad/[slug]/page.js. Next.js
// resolves a static segment before a dynamic one, so this page wins today —
// but a future post slugged "big-berg-racing" would be silently shadowed by
// this file and would need a different slug instead.

// The team tag is the single source of truth for what appears here. Tag a post
// "Big Berg Racing" in its frontmatter and it shows up on this page; nothing
// else has to be edited. Post tags render as plain text, not links, so this
// tag deliberately has no hub under /race-dad/tags — this page is the hub.
const TEAM_TAG = 'Big Berg Racing'

// Numbers come from each rider's own page, never from the plate in the
// photograph — school and rental bikes carry the school's numbers, so the
// bike beside a name may well be wearing somebody else's.
const RIDERS = [
  {
    slug: 'abel',
    name: 'Abel Byberg',
    number: '17',
    line: 'FIM MotoMini Canada · 160cc',
    photo: '/images/race-dad/abel/abel-face.jpg',
    alt: 'Abel Byberg in the paddock, in Ohvale leathers',
  },
  {
    slug: 'cohen',
    name: 'Cohen Byberg',
    number: '27',
    line: 'FIM MotoMini Canada · 190cc',
    photo: '/images/race-dad/cohen/cohen-face.jpg',
    alt: 'Cohen Byberg on track with his visor up',
  },
  {
    slug: 'crosby',
    name: 'Crosby Byberg',
    number: '7',
    line: 'MiniSBK · Honda CRF50',
    photo: '/images/race-dad/crosby/crosby-face.jpg',
    alt: 'Crosby Byberg riding a red Honda CRF50 at a kart circuit',
  },
]

const description =
  'Big Berg Racing — the family minimoto team. Abel, Cohen and Crosby Byberg racing FIM MotoMini Canada and MiniSBK across Ontario and Quebec, and every race report about them.'

export const metadata = {
  title: 'Big Berg Racing',
  description,
  alternates: { canonical: racedadUrl('big-berg-racing') },
  openGraph: {
    type: 'website',
    url: racedadUrl('big-berg-racing'),
    siteName: 'Race Dad',
    title: 'Big Berg Racing',
    description,
    locale: 'en_CA',
    images: [
      {
        url: `${RACEDAD_ORIGIN}/images/race-dad/big-berg-racing/bbr-red-square.jpg`,
        width: 920,
        height: 899,
        alt: 'The Big Berg Racing team logo',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Big Berg Racing',
    description,
    images: [
      `${RACEDAD_ORIGIN}/images/race-dad/big-berg-racing/bbr-red-square.jpg`,
    ],
  },
}

export default function BigBergRacingPage() {
  const posts = getAllPosts('race-dad').filter((post) =>
    (post.tags || []).includes(TEAM_TAG),
  )

  // A tag typo or a content-loading regression would otherwise render a
  // perfectly plausible page with no posts on it. This page is only correct
  // when the tag matches something, so an empty list fails the build instead
  // of shipping quietly.
  if (posts.length === 0) {
    throw new Error(
      `No posts tagged "${TEAM_TAG}" — the Big Berg Racing page would render empty. ` +
        'Check the tag spelling in src/content/race-dad/*.md.',
    )
  }

  return (
    <article className="article">
      <section className="bbr-hero">
        <Image
          className="bbr-logo"
          src="/images/race-dad/big-berg-racing/big-berg-racing-logo.png"
          alt="Big Berg Racing team logo"
          width={900}
          height={875}
          sizes="8rem"
          priority
        />
        <div className="bbr-intro">
          <p className="data">The family team</p>
          <h1>Big Berg Racing</h1>
          <p>
            Three brothers, three classes, one trailer. Abel and Cohen race
            Ohvales in FIM MotoMini Canada; Crosby races a Honda CRF50 in
            MiniSBK. This is the team page &mdash; the riders, and every post
            on this site about their racing.
          </p>
        </div>
      </section>

      <section className="bbr-riders" aria-label="The riders">
        {RIDERS.map((rider) => (
          <Link
            className="bbr-rider"
            href={`/race-dad/${rider.slug}`}
            key={rider.slug}
          >
            <Image
              className="bbr-face"
              src={rider.photo}
              alt={rider.alt}
              width={512}
              height={512}
              sizes="4.5rem"
            />
            <span className="bbr-rider-id">
              <span className="bbr-rider-name">
                <span className="bbr-plate" aria-hidden="true">
                  {rider.number}
                </span>
                {rider.name}
              </span>
              <span className="data">{rider.line}</span>
            </span>
          </Link>
        ))}
      </section>

      <section className="year-group" aria-label="Posts about the team">
        <div className="year-head">
          <h2>Race reports</h2>
          <span className="data">
            {posts.length} {posts.length === 1 ? 'post' : 'posts'}
          </span>
        </div>

        <div className="sheet-head">
          <span className="data">Lap</span>
          <span className="data">Post</span>
          <span className="data">Topic</span>
          <span className="data">Date</span>
        </div>

        {posts.map((post, i) => (
          <Link
            className="lap"
            href={`/race-dad/${post.slug}`}
            key={post.slug}
          >
            <span className="no">
              {String(posts.length - i).padStart(2, '0')}
            </span>
            <div className="title">
              {post.image ? (
                <Image
                  className="thumb"
                  src={post.image}
                  alt=""
                  width={176}
                  height={116}
                />
              ) : (
                <span className="thumb kerb" aria-hidden="true" />
              )}
              <div className="title-text">
                <h2>{post.title}</h2>
                {post.excerpt ? (
                  <p className="excerpt">{post.excerpt}</p>
                ) : null}
              </div>
            </div>
            <div className="tags">
              {post.tags
                .filter((t) => t !== TEAM_TAG)
                .slice(0, 2)
                .map((t) => (
                  <span key={t}>{t}</span>
                ))}
            </div>
            <span className="when data">{post.date}</span>
          </Link>
        ))}
      </section>

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
