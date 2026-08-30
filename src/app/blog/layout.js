import { aiMono } from '@/app/fonts'
import './blog.css'
import { AI_ORIGIN } from '@/lib/seo'

// Signature mono voice for the AI blog: labels, the trace-node markers,
// and code blocks. Exposed as a CSS variable per the CSS isolation
// contract (docs/superpowers/specs/2026-08-24-blogs-and-landing-design.md)
// — never a <link> tag, never applied outside .ai-root.

const blogDescription =
  'Notes from building with AI in production: multi-model orchestration, automating the boring parts, and forcing AI to fix its own mistakes.'

// Without an openGraph block here the blog inherits the ROOT layout's, which
// belongs to joshbyberg.com - so every post shared as the wrong site with the
// wrong picture. The worker rewrites canonical, og:url and og:site_name at the
// edge but leaves og:image alone, so the image has to be right at the source.
export const metadata = {
  title: {
    default: 'AI Blog',
    template: '%s | AI Blog — Josh Byberg',
  },
  description: blogDescription,
  openGraph: {
    type: 'website',
    url: `${AI_ORIGIN}/blog`,
    siteName: 'Whitespace AI',
    title: 'AI Blog',
    description: blogDescription,
    locale: 'en_CA',
    images: [
      {
        url: `${AI_ORIGIN}/images/og-ai.png`,
        width: 1200,
        height: 630,
        alt: 'Whitespace AI',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Blog',
    description: blogDescription,
    images: [`${AI_ORIGIN}/images/og-ai.png`],
  },
}

export default function BlogLayout({ children }) {
  return (
    <div className={`ai-root ${aiMono.variable}`}>{children}</div>
  )
}
