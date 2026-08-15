import './globals.css'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

const siteUrl = 'https://joshbyberg.com'
const siteTitle = 'Josh Byberg — Web Developer & Graphic Designer'
const siteDescription =
  'Full-stack developer and graphic designer in Oshawa, Ontario. I build fast, responsive websites and web apps with React, Next.js, Python, WordPress and Shopify.'

export const metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: siteTitle,
    template: '%s | Josh Byberg',
  },
  description: siteDescription,
  applicationName: 'Josh Byberg',
  authors: [{ name: 'Josh Byberg', url: siteUrl }],
  creator: 'Josh Byberg',
  keywords: [
    'Josh Byberg',
    'web developer',
    'web designer',
    'graphic designer',
    'full-stack developer',
    'Next.js',
    'React',
    'Oshawa',
    'Durham Region',
    'Ontario',
  ],
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    url: siteUrl,
    siteName: 'Josh Byberg',
    title: siteTitle,
    description: siteDescription,
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
    title: siteTitle,
    description: siteDescription,
    images: ['/images/og-image.png'],
  },
  // Google Search Console ownership proof for the https://joshbyberg.com
  // URL-prefix property. Not a secret — it is served in the page source by
  // design. Removing it un-verifies the property, so leave it in place.
  verification: {
    google: 'lFulI05BSOQpfqLHpeT5W_eMxD8Qqjx92jraM3ZvyEY',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

// ProfessionalService (not Person): this site markets a local web-design and
// development service, so the entity schema carries the service area, service
// types, and profile links that both search engines and AI assistants extract.
const professionalServiceSchema = {
  '@context': 'https://schema.org',
  '@type': 'ProfessionalService',
  name: 'Josh Byberg — Web Developer & Graphic Designer',
  description: siteDescription,
  url: siteUrl,
  email: 'info@joshbyberg.com',
  image: `${siteUrl}/images/og-image.png`,
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Oshawa',
    addressRegion: 'ON',
    addressCountry: 'CA',
  },
  // Mirrors SERVICE_AREA in src/app/oshawa/offer-config.js plus the region
  // itself. Keep the two lists in sync if the service area changes.
  areaServed: [
    { '@type': 'AdministrativeArea', name: 'Durham Region', addressRegion: 'ON', addressCountry: 'CA' },
    { '@type': 'City', name: 'Oshawa', addressRegion: 'ON', addressCountry: 'CA' },
    { '@type': 'Town', name: 'Whitby', addressRegion: 'ON', addressCountry: 'CA' },
    { '@type': 'Place', name: 'Courtice', addressRegion: 'ON', addressCountry: 'CA' },
    { '@type': 'AdministrativeArea', name: 'Clarington', addressRegion: 'ON', addressCountry: 'CA' },
    { '@type': 'Town', name: 'Ajax', addressRegion: 'ON', addressCountry: 'CA' },
    { '@type': 'Place', name: 'Bowmanville', addressRegion: 'ON', addressCountry: 'CA' },
  ],
  sameAs: [
    'https://github.com/jcbyberg',
    'https://www.linkedin.com/in/joshua-byberg-134b91208/',
  ],
  founder: {
    '@type': 'Person',
    name: 'Josh Byberg',
    jobTitle: 'Web Developer & Graphic Designer',
    email: 'info@joshbyberg.com',
    sameAs: [
      'https://github.com/jcbyberg',
      'https://www.linkedin.com/in/joshua-byberg-134b91208/',
    ],
  },
  serviceType: [
    'Web development',
    'Web design',
    'Graphic design',
    'Brand identity design',
    'E-commerce development',
    'AI implementation and workflow automation',
  ],
  knowsAbout: [
    'Web development',
    'Graphic design',
    'React',
    'Next.js',
    'Python',
    'WordPress',
    'Shopify',
  ],
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(professionalServiceSchema),
          }}
        />
      </body>
    </html>
  )
}
