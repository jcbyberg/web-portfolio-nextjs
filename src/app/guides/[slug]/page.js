import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getPost, getPostSlugs } from '@/lib/posts'
import { postOpenGraphImage } from '@/lib/seo'
import { JOSHBYBERG_ORIGIN } from '@/lib/seo'

const siteUrl = JOSHBYBERG_ORIGIN

export function generateStaticParams() {
  return getPostSlugs('joshbyberg').map((slug) => ({ slug }))
}

export async function generateMetadata({ params }) {
  const post = await getPost('joshbyberg', params.slug).catch(() => null)
  if (!post) return {}

  const url = `${siteUrl}/guides/${post.slug}`
  const images = postOpenGraphImage(post, siteUrl) ?? [
    {
      url: `${siteUrl}/images/og-image.png`,
      alt: 'Josh Byberg — Web Developer & Graphic Designer',
    },
  ]

  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: url },
    openGraph: {
      type: 'article',
      url,
      siteName: 'Josh Byberg',
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
      images: images.map((image) => image.url),
    },
  }
}

function formatDate(iso) {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString('en-CA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  })
}

export default async function GuidePostPage({ params }) {
  const post = await getPost('joshbyberg', params.slug).catch(() => null)
  if (!post) notFound()

  return (
    <div className="guides-shell">
      <article className="guide-article">
        <header className="guide-article-head">
          <Link href="/guides" className="guide-back">← All guides</Link>
          <p className="guides-date">
            {formatDate(post.date)}
            {post.author ? <> · {post.author}</> : null}
          </p>
          <h1>{post.title}</h1>
          <p className="guide-excerpt">{post.excerpt}</p>
          <div className="guide-tags">
            {post.tags.map((tag) => <span key={tag}>{tag}</span>)}
          </div>
        </header>

        <div
          className="guide-body"
          dangerouslySetInnerHTML={{ __html: post.contentHtml }}
        />

        <aside className="guide-cta">
          <p className="guides-kicker">Need a website that pulls its weight?</p>
          <h2>Let’s build the useful version.</h2>
          <p>
            Tell me what your business does and what the current site is not doing.
            I’ll help you turn that into a clear next step.
          </p>
          <Link href="/bring-your-idea-to-life">Bring your idea to life</Link>
        </aside>
      </article>
    </div>
  )
}
