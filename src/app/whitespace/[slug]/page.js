import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getAllPosts, getPostSlugs, getPost } from '@/lib/posts'

export async function generateStaticParams() {
  return getPostSlugs('whitespace').map((slug) => ({ slug }))
}

export async function generateMetadata({ params }) {
  const post = await getPost('whitespace', params.slug).catch(() => null)
  if (!post) return {}
  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: `/whitespace/${post.slug}` },
  }
}

function fmt(dateStr) {
  const d = new Date(`${dateStr}T00:00:00Z`)
  return d.toLocaleDateString('en-CA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  })
}

export default async function WhitespacePostPage({ params }) {
  const posts = getAllPosts('whitespace')
  if (!posts.some((p) => p.slug === params.slug)) notFound()

  const post = await getPost('whitespace', params.slug)
  const isCaseStudy = post.type === 'case-study'

  return (
    <article className="article">
      <div className="article-head">
        <p className="spec">
          {isCaseStudy ? post.client : 'Essay'} &middot; {fmt(post.date)}
        </p>
        <h1>{post.title}</h1>

        {isCaseStudy ? (
          <dl className="specsheet">
            <div>
              <dt className="spec">Client</dt>
              <dd>{post.client}</dd>
            </div>
            <div>
              <dt className="spec">Deliverable</dt>
              <dd>{post.deliverable}</dd>
            </div>
            <div>
              <dt className="spec">Trim</dt>
              <dd>{post.trim}</dd>
            </div>
            <div>
              <dt className="spec">Colour</dt>
              <dd>{post.colour}</dd>
            </div>
          </dl>
        ) : (
          <div className="essay-marker">
            <span className="spec">Field notes, not a spec sheet</span>
          </div>
        )}
      </div>

      <div
        className="article-body"
        dangerouslySetInnerHTML={{ __html: post.contentHtml }}
      />

      <section className="cta">
        <p className="spec">Available for work</p>
        <h2>Got a piece that has to earn its place on a table?</h2>
        <p>
          I design print, trade show graphics, websites and social media for small
          businesses and racing programs across Ontario.
        </p>
        <Link className="btn" href="/bring-your-idea-to-life">
          Bring Your Idea to Life
        </Link>
      </section>
    </article>
  )
}
