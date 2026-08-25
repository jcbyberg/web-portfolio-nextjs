import { notFound } from 'next/navigation'
import { getAllPosts, getPostSlugs, getPost } from '@/lib/posts'
import Masthead from '../_components/Masthead'
import Footer from '../_components/Footer'
import Cta from '../_components/Cta'

function formatDate(iso) {
  return new Date(`${iso}T00:00:00`).toLocaleDateString('en-CA', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
  })
}

export function generateStaticParams() {
  return getPostSlugs('ai').map((slug) => ({ slug }))
}

export async function generateMetadata({ params }) {
  const post = await getPost('ai', params.slug)
  if (!post) return {}
  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: `/blog/${post.slug}` },
  }
}

export default async function BlogPostPage({ params }) {
  const post = await getPost('ai', params.slug)
  if (!post) {
    notFound()
  }

  const allPosts = getAllPosts('ai')
  const index = allPosts.findIndex((p) => p.slug === post.slug)

  return (
    <div className="ai-wrap">
      <Masthead />

      <article className="ai-article">
        <div className="ai-article-head">
          <span className="ai-node">{String(index + 1).padStart(2, '0')}</span>
          <h1>{post.title}</h1>
          <div className="ai-article-meta">
            <span className="ai-date">{formatDate(post.date)}</span>
            {post.tags.map((tag) => (
              <span key={tag} className="ai-node">{tag}</span>
            ))}
          </div>
        </div>

        <div
          className="ai-article-body"
          dangerouslySetInnerHTML={{ __html: post.contentHtml }}
        />

        <Cta />
      </article>

      <Footer />
    </div>
  )
}
