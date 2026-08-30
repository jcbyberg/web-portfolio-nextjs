import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getAllPosts, getPostSlugs, getPost } from '@/lib/posts'
import {
  whitespaceUrl,
  WHITESPACE_ORIGIN,
  postOpenGraphImage,
  postImageUrl,
  blogPostingSchema,
  breadcrumbSchema,
} from '@/lib/seo'
import Punct from '@/app/whitespace/punct'

export async function generateStaticParams() {
  return getPostSlugs('whitespace').map((slug) => ({ slug }))
}

export async function generateMetadata({ params }) {
  const post = await getPost('whitespace', params.slug).catch(() => null)
  if (!post) return {}
  const url = whitespaceUrl(post.slug)
  const images = postOpenGraphImage(post, WHITESPACE_ORIGIN)
  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: url },
    openGraph: {
      type: 'article',
      url,
      // siteName and locale are restated from the layout on purpose: Next
      // REPLACES a parent's openGraph object rather than merging into it, so
      // anything not repeated here is simply absent from a post's tags.
      siteName: 'Whitespace Design',
      locale: 'en_CA',
      title: post.title,
      description: post.excerpt,
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

  const url = whitespaceUrl(post.slug)
  const blogPosting = blogPostingSchema({
    url,
    headline: post.title,
    description: post.excerpt,
    datePublished: post.date,
    image: postImageUrl(post, WHITESPACE_ORIGIN),
    organizationId: `${WHITESPACE_ORIGIN}/#organization`,
  })
  const breadcrumb = breadcrumbSchema([
    { name: 'Whitespace Design', url: `${WHITESPACE_ORIGIN}/` },
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
        <Punct>
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
        </Punct>
      </div>

      <div
        className="article-body"
        dangerouslySetInnerHTML={{ __html: post.contentHtml }}
      />

      <section className="cta">
        <p className="spec">Available for work</p>
        <h2>
          <Punct>Got a piece that has to earn its place on a table?</Punct>
        </h2>
        <p>
          I design print, trade show graphics, websites and social media for small
          businesses and racing programs across Ontario.
        </p>
        <Link className="btn" href="/bring-your-idea-to-life">
          Bring Your Idea to Life
        </Link>
      </section>
    </article>
    </>
  )
}
