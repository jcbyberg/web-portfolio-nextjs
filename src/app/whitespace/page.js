import Link from 'next/link'
import { getAllPosts } from '@/lib/posts'

export const metadata = {
  description:
    'A design blog by Josh Byberg — print, brand systems and trade show work, shown with the specs.',
}

function fmt(dateStr) {
  const d = new Date(`${dateStr}T00:00:00Z`)
  return d
    .toLocaleDateString('en-CA', { year: 'numeric', month: 'short', timeZone: 'UTC' })
    .toUpperCase()
}

export default function WhitespaceIndexPage() {
  const posts = getAllPosts('whitespace')

  return (
    <>
      <section className="hero">
        <p className="spec">Design journal &middot; Print, identity &amp; large format</p>
        <h1>
          The work, <span>and the specs it was built to.</span>
        </h1>
        <p>
          I&rsquo;m Josh Byberg. I design print and brand collateral for people who have
          to hand something to a stranger and get one shot at it &mdash; race schools,
          series organizers, small businesses. Every piece here shipped to a printer.
          These are the decisions behind them.
        </p>
      </section>

      <div className="colourbar" aria-hidden="true">
        <i></i>
        <i></i>
        <i></i>
        <i></i>
      </div>

      <section style={{ marginTop: 'clamp(3rem,8vh,5rem)' }}>
        <div className="index-head">
          <span className="spec">No.</span>
          <span className="spec">Project</span>
          <span className="spec">Deliverable</span>
          <span className="spec">Date</span>
        </div>

        {posts.map((post, i) => (
          <Link key={post.slug} className="entry" href={`/whitespace/${post.slug}`}>
            <span className="entry-no">{String(posts.length - i).padStart(2, '0')}</span>
            <div>
              <h2>{post.title}</h2>
              <p>{post.excerpt}</p>
            </div>
            <div className="entry-meta">
              <div className="spec">{post.deliverable ?? 'Essay'}</div>
              <div className="spec">{post.trim ?? '—'}</div>
            </div>
            <div className="entry-date spec">{fmt(post.date)}</div>
          </Link>
        ))}
      </section>

      <section className="cta">
        <p className="spec">Available for work</p>
        <h2>Need something that has to survive a print run?</h2>
        <p>
          I do web design, print collateral, trade show graphics and social media for
          small businesses and racing programs across Ontario. If you have a booth, a
          brochure or a site that isn&rsquo;t pulling its weight, let&rsquo;s talk.
        </p>
        <Link className="btn" href="/bring-your-idea-to-life">
          Bring Your Idea to Life
        </Link>
      </section>
    </>
  )
}
