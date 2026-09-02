import './race-dad.css'
import { rdDisplay, rdBody, rdMono } from '@/app/fonts'
import { Masthead, SiteFooter } from './BrandChrome'
import { RACEDAD_ORIGIN, organizationSchema } from '@/lib/seo'

const rdTitle = 'Race Dad — Canadian minimoto from the pit wall'
const rdDescription =
  'A dad following his kids through Canadian minimoto and supermoto racing — Ohvale, MiniSBK, FIM MotoMini Canada.'

export const metadata = {
  title: {
    default: rdTitle,
    template: '%s | Race Dad',
  },
  description: rdDescription,
  openGraph: {
    type: 'website',
    url: `${RACEDAD_ORIGIN}/`,
    siteName: 'Race Dad',
    title: rdTitle,
    description: rdDescription,
    locale: 'en_CA',
    images: [
      {
        url: `${RACEDAD_ORIGIN}/images/race-dad/brand/og-race-dad.png`,
        width: 1200,
        height: 630,
        alt: 'Race Dad',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: rdTitle,
    description: rdDescription,
    images: [`${RACEDAD_ORIGIN}/images/race-dad/brand/og-race-dad.png`],
  },
}

const rdOrganization = organizationSchema({
  origin: RACEDAD_ORIGIN,
  name: 'Race Dad',
})

export default function RaceDadLayout({ children }) {
  return (
    <div
      className={`rd-root ${rdDisplay.variable} ${rdBody.variable} ${rdMono.variable}`}
    >
      <div className="wrap">
        <Masthead />

        <main>{children}</main>

        <SiteFooter />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(rdOrganization) }}
        />
      </div>
    </div>
  )
}
