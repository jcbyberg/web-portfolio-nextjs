import Link from 'next/link'
import { getAllPosts } from '@/lib/posts'

export const metadata = {
  alternates: { canonical: '/race-dad' },
}

function groupByYear(posts) {
  const groups = new Map()
  for (const post of posts) {
    const year = post.date.slice(0, 4)
    if (!groups.has(year)) groups.set(year, [])
    groups.get(year).push(post)
  }
  return [...groups.entries()].sort((a, b) => Number(b[0]) - Number(a[0]))
}

export default function RaceDadIndexPage() {
  const posts = getAllPosts('race-dad')
  const groups = groupByYear(posts)
  const total = posts.length
  const lapNumbers = new Map(posts.map((post, i) => [post.slug, total - i]))

  return (
    <>
      <section className="hero">
        <div>
          <p className="data">Ontario &middot; Quebec &middot; Minimoto &amp; Supermoto</p>
          <h1>
            Notes from <u>the pit wall</u>
          </h1>
          <p>
            I&apos;m Josh, dad to Abel, Crosby and Cohen. They race in the Canadian
            minimoto scene and I&apos;m the guy holding the board. This is the
            parking lot drills, the tire pressures, the budget, the rain, the long
            drive home &mdash; and the tight-knit group of people who make the whole
            thing run.
          </p>
        </div>

        <div
          className="pitboard"
          role="img"
          aria-label="Pit board showing position 3, gap 0.4 seconds, 6 laps remaining, message: breathe"
        >
          <div className="row">
            <span className="k">P</span>
            <span className="v">3</span>
          </div>
          <div className="row">
            <span className="k">GAP</span>
            <span className="v">+0.4</span>
          </div>
          <div className="row">
            <span className="k">L</span>
            <span className="v">6</span>
          </div>
          <div className="row msg">
            <span className="k">MSG</span>
            <span className="v">BREATHE</span>
          </div>
        </div>
      </section>

      {groups.map(([year, yearPosts]) => (
        <section className="year-group" key={year}>
          <div className="year-head">
            <h2>{year}</h2>
            <span className="data">
              {yearPosts.length} {yearPosts.length === 1 ? 'post' : 'posts'}
            </span>
          </div>

          <div className="sheet-head">
            <span className="data">Lap</span>
            <span className="data">Post</span>
            <span className="data">Topic</span>
            <span className="data">Date</span>
          </div>

          {yearPosts.map((post, i) => (
            <Link className="lap" href={`/race-dad/${post.slug}`} key={post.slug}>
              <span className="no">{String(lapNumbers.get(post.slug)).padStart(2, '0')}</span>
              <h2>{post.title}</h2>
              <div className="tags">
                {post.tags.slice(0, 2).map((t) => (
                  <span key={t}>{t}</span>
                ))}
              </div>
              <span className="when data">{post.date}</span>
            </Link>
          ))}
        </section>
      ))}

      <section className="cta">
        <p className="data">Off the bike, this is my day job</p>
        <h2>I build websites for people in the paddock</h2>
        <p>
          When I&apos;m not carrying the snacks, I run a web design and digital
          marketing practice &mdash; sites, social media, and print for small
          businesses, race schools and series organizers.
        </p>
        <Link className="btn" href="/bring-your-idea-to-life">
          Bring Your Idea to Life
        </Link>
      </section>
    </>
  )
}
