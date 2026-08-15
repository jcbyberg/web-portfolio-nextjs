import OshawaLanding from './OshawaLanding'

const title = 'The $500 Website Package — Oshawa & Durham Region'
const description =
  'A new website or a rebuild of your current one, for Oshawa and Durham Region businesses. Built to be found in local search, mobile-first, live in five business days. CAD $500 plus HST.'

export const metadata = {
  title,
  description,
  alternates: {
    canonical: '/oshawa',
  },
  openGraph: {
    type: 'website',
    url: 'https://joshbyberg.com/oshawa',
    title,
    description,
    locale: 'en_CA',
    images: [
      {
        url: '/images/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Josh Byberg — Web Developer & Graphic Designer',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description,
    images: ['/images/og-image.png'],
  },
}

export default function OshawaOfferPage() {
  return <OshawaLanding />
}
