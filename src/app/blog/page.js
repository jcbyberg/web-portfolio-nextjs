import Link from 'next/link'
import { getAllPosts } from '@/lib/posts'
import Masthead from './_components/Masthead'
import Footer from './_components/Footer'
import Cta from './_components/Cta'

export const metadata = {
  title: 'AI Blog',
  alternates: { canonical: '/blog' },
}

function formatDate(iso) {
  return new Date(`${iso}T00:00:00`).toLocaleDateString('en-CA', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
  })
}

export default function BlogIndexPage() {
  const posts = getAllPosts('ai')

  return (
    <>
      <div className="ai-wrap">
        <Masthead />

        <section className="ai-hero">
          <p className="ai-mono-label">[LOG] /blog — 06 entries</p>
          <h1>
            Building with AI, <span className="ai-accent-text">in production.</span>
          </h1>
          <p>
            Notes from the work itself — orchestrating multiple models, automating
            the busywork nobody wants, and making AI clean up after its own
            mistakes. Written for people who buy this stuff, not just people who
            build it.
          </p>
        </section>

        <section className="ai-log">
          <div className="ai-index-head">
            <span className="ai-mono-label">No.</span>
            <span className="ai-mono-label">Entry</span>
            <span className="ai-mono-label">Tags</span>
            <span className="ai-mono-label" style={{ textAlign: 'right' }}>Date</span>
          </div>
          {posts.map((post, index) => (
            <Link key={post.slug} href={`/blog/${post.slug}`} className="ai-entry">
              <span className="ai-node">{String(index + 1).padStart(2, '0')}</span>
              <div>
                <h2>{post.title}</h2>
                <p>{post.excerpt}</p>
              </div>
              <div className="ai-tags">
                {post.tags.slice(0, 3).map((tag) => (
                  <span key={tag}>{tag}</span>
                ))}
              </div>
              <span className="ai-date">{formatDate(post.date)}</span>
            </Link>
          ))}
        </section>

        <Cta />
        <Footer />
      </div>
    </>
  )
}
