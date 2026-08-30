import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getPostSlugs, getPost } from '@/lib/posts'
import {
  racedadUrl,
  RACEDAD_ORIGIN,
  postOpenGraphImage,
  postImageUrl,
  blogPostingSchema,
  breadcrumbSchema,
} from '@/lib/seo'

export async function generateStaticParams() {
  return getPostSlugs('race-dad').map((slug) => ({ slug }))
}

export async function generateMetadata({ params }) {
  const post = await getPost('race-dad', params.slug).catch(() => null)
  if (!post) return {}
  const url = racedadUrl(post.slug)
  const images = postOpenGraphImage(post, RACEDAD_ORIGIN)
  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: url },
    openGraph: {
      type: 'article',
      url,
      siteName: 'Race Dad',
      title: post.title,
      description: post.excerpt,
      locale: 'en_CA',
      publishedTime: post.date ?? undefined,
      ...(images ? { images } : {}),
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
      ...(images ? { images: images.map((img) => img.url) } : {}),
    },
  }
}

function fmt(dateStr) {
  return new Date(`${dateStr}T00:00:00Z`).toLocaleDateString('en-CA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  })
}

export default async function RaceDadPostPage({ params }) {
  const post = await getPost('race-dad', params.slug).catch(() => null)
  if (!post) notFound()

  const url = racedadUrl(post.slug)
  const blogPosting = blogPostingSchema({
    url,
    headline: post.title,
    description: post.excerpt,
    datePublished: post.date,
    image: postImageUrl(post, RACEDAD_ORIGIN),
    organizationId: `${RACEDAD_ORIGIN}/#organization`,
  })
  const breadcrumb = breadcrumbSchema([
    { name: 'Race Dad', url: `${RACEDAD_ORIGIN}/` },
    { name: post.title, url },
  ])

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogPosting) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />
      <article className="article">
      <div className="article-head">
        <p className="data">
          {fmt(post.date)}
          {post.author ? <> &middot; {post.author}</> : null}
        </p>
        <h1>{post.title}</h1>
        <div className="article-meta">
          {post.tags.map((t) => (
            <span className="data" key={t}>
              {t}
            </span>
          ))}
        </div>
      </div>

      {post.video ? (
        <div className="article-body">
          <video controls playsInline preload="metadata" src={post.video} />
        </div>
      ) : null}

      <div
        className="article-body"
        dangerouslySetInnerHTML={{ __html: post.contentHtml }}
      />

      <section className="cta">
        <p className="data">Off the bike, this is my day job</p>
        <h2>I build websites for people in the paddock</h2>
        <p>
          Web design, social media and print for small businesses, race schools and
          series organizers across Ontario.
        </p>
        <Link className="btn" href="/bring-your-idea-to-life">
          Bring Your Idea to Life
        </Link>
      </section>
    </article>
    </>
  )
}
