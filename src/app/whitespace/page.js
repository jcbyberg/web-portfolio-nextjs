import Link from 'next/link'
import { getAllPosts } from '@/lib/posts'
import { whitespaceUrl, WHITESPACE_ORIGIN, blogSchema } from '@/lib/seo'
import Punct from '@/app/whitespace/punct'

export const metadata = {
  description:
    'A design blog by Josh Byberg — print, brand systems and trade show work, shown with the specs.',
  alternates: { canonical: whitespaceUrl() },
}

function fmt(dateStr) {
  const d = new Date(`${dateStr}T00:00:00Z`)
  return d
    .toLocaleDateString('en-CA', { year: 'numeric', month: 'short', timeZone: 'UTC' })
    .toUpperCase()
}

export default function WhitespaceIndexPage() {
  const posts = getAllPosts('whitespace')
  const blog = blogSchema({
    origin: WHITESPACE_ORIGIN,
    name: 'Whitespace Designs',
    description:
      'A design blog by Josh Byberg — print, brand systems and trade show work, shown with the specs.',
    postSlugs: posts.map((p) => p.slug),
  })

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blog) }}
      />
      <section className="hero">
        <p className="spec">
          <Punct>Design journal &middot; Print, identity &amp; large format</Punct>
        </p>
        <h1>
          <Punct>
            The work, <span>and the specs it was built to.</span>
          </Punct>
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
              <h2>
                <Punct>{post.title}</Punct>
              </h2>
              <p>{post.excerpt}</p>
            </div>
            <div className="entry-meta">
              <div className="spec">
                <Punct>{post.deliverable ?? 'Essay'}</Punct>
              </div>
              <div className="spec">
                <Punct>{post.trim ?? '—'}</Punct>
              </div>
            </div>
            <div className="entry-date spec">
              <Punct>{fmt(post.date)}</Punct>
            </div>
          </Link>
        ))}
      </section>

      <section className="cta">
        <p className="spec">Available for work</p>
        <h2>
          <Punct>Need something that has to survive a print run?</Punct>
        </h2>
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
