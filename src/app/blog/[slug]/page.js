import { notFound } from 'next/navigation'
import { getAllPosts, getPostSlugs, getPost } from '@/lib/posts'
import { AI_ORIGIN, postOpenGraphImage } from '@/lib/seo'
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
  const url = `${AI_ORIGIN}/blog/${post.slug}`
  // A post with no image of its own falls back to the site card rather than
  // inheriting the root layout's joshbyberg.com one.
  const images = postOpenGraphImage(post, AI_ORIGIN) ?? [
    { url: `${AI_ORIGIN}/images/og-ai.png`, alt: 'Whitespace AI' },
  ]
  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: url },
    openGraph: {
      type: 'article',
      url,
      // Restated from the layout on purpose: Next REPLACES a parent's
      // openGraph object rather than merging into it.
      siteName: 'Whitespace AI',
      locale: 'en_CA',
      title: post.title,
      description: post.excerpt,
      publishedTime: post.date ?? undefined,
      images,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
      images: images.map((img) => img.url),
    },
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
