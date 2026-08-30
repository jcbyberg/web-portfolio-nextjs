import { wsaiDisplay, wsaiMono } from '@/app/fonts'
import Link from 'next/link'
import './ai.css'
import {
  AI_ORIGIN,
  WHITESPACE_ORIGIN,
  aiUrl,
  organizationSchema,
  serviceSchema,
} from '@/lib/seo'

const aiTitle = 'Whitespace AI — automation for small businesses in Ontario'
const aiDescription =
  'Custom automation for businesses with 5 to 30 staff: marketing that ships without a coordinator, footage that finds itself, and pipelines built around how you already work.'

// Set in full rather than inherited. Next REPLACES a parent openGraph object
// instead of merging it, so a partial declaration here would silently drop
// siteName, locale and images — the failure that put a wrong og:url on 18
// pages in the 2026-08-29 SEO pass.
export const metadata = {
  metadataBase: new URL(AI_ORIGIN),
  title: {
    default: aiTitle,
    absolute: aiTitle,
    template: '%s — Whitespace AI',
  },
  description: aiDescription,
  alternates: { canonical: aiUrl() },
  openGraph: {
    type: 'website',
    url: aiUrl(),
    siteName: 'Whitespace AI',
    title: aiTitle,
    description: aiDescription,
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
    title: aiTitle,
    description: aiDescription,
    images: [`${AI_ORIGIN}/images/og-ai.png`],
  },
}

// sameAs points at the sibling properties so crawlers read the subdomain, the
// apex and joshbyberg.com as one operator. This is the available mitigation for
// a subdomain starting with none of the apex's inherited authority.
const aiOrganization = organizationSchema({
  origin: AI_ORIGIN,
  name: 'Whitespace AI',
  otherBrandOrigin: WHITESPACE_ORIGIN,
})

const aiService = serviceSchema({
  origin: AI_ORIGIN,
  name: 'Business automation and AI systems',
  description: aiDescription,
  serviceType: 'Business process automation',
  areaServed: ['Durham Region', 'Oshawa', 'Whitby', 'Greater Toronto Area', 'Ontario'],
})

export default function AiLayout({ children }) {
  return (
    <div className={`wsai-root ${wsaiDisplay.variable} ${wsaiMono.variable}`}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(aiOrganization) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(aiService) }}
      />

      <div className="wsai-wrap">
        <header className="wsai-masthead">
          <Link className="wsai-wordmark" href="/ai">
            White<em />space AI
          </Link>
          <nav>
            <a href={WHITESPACE_ORIGIN}>Design studio</a>
            <a href={`${WHITESPACE_ORIGIN}/hire-me`}>Get in touch</a>
          </nav>
        </header>

        <main>{children}</main>

        <footer className="wsai-footer">
          <span>Whitespace AI — Josh Byberg</span>
          <a href={WHITESPACE_ORIGIN}>Whitespace Designs</a>
          <a href={`${WHITESPACE_ORIGIN}/hire-me`}>Get in touch</a>
        </footer>
      </div>
    </div>
  )
}
