import Image from 'next/image'
import Link from 'next/link'
import { getAllPosts } from '@/lib/posts'
import { AI_ORIGIN } from '@/lib/seo'
import Masthead from './_components/Masthead'
import Footer from './_components/Footer'
import Cta from './_components/Cta'

export const metadata = {
  title: 'AI Blog',
  // Absolute, not '/blog': a relative canonical resolves against metadataBase,
  // which is joshbyberg.com, and this index lives on the AI subdomain.
  alternates: { canonical: `${AI_ORIGIN}/blog` },
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
          <p className="ai-mono-label">
            [LOG] /blog — {String(posts.length).padStart(2, '0')} entries
          </p>
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
              <div className="ai-entry-title">
                {post.image ? (
                  <Image
                    className="ai-thumb"
                    src={post.image}
                    alt=""
                    width={112}
                    height={72}
                  />
                ) : (
                  // Every post carries an image today, but this stays for the
                  // day one doesn't — a placeholder in the blog's own terminal
                  // aesthetic (a bracketed null-frame) rather than a hole in
                  // the row.
                  <span className="ai-thumb ai-thumb-empty" aria-hidden="true">
                    [ ]
                  </span>
                )}
                <div className="ai-title-text">
                  <h2>{post.title}</h2>
                  <p>{post.excerpt}</p>
                </div>
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
