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
    'graphic designer',
    'full-stack developer',
    'Next.js',
    'React',
    'Oshawa',
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

const personSchema = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Josh Byberg',
  url: siteUrl,
  jobTitle: 'Web Developer & Graphic Designer',
  email: 'mailto:info@joshbyberg.com',
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Oshawa',
    addressRegion: 'ON',
    addressCountry: 'CA',
  },
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
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
        />
      </body>
    </html>
  )
}
