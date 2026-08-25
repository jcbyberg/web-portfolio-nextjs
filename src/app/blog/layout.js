import { JetBrains_Mono } from 'next/font/google'
import './blog.css'

// Signature mono voice for the AI blog: labels, the trace-node markers,
// and code blocks. Exposed as a CSS variable per the CSS isolation
// contract (docs/superpowers/specs/2026-08-24-blogs-and-landing-design.md)
// — never a <link> tag, never applied outside .ai-root.
const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--ai-font-mono',
  display: 'swap',
})

export const metadata = {
  title: {
    default: 'AI Blog',
    template: '%s | AI Blog — Josh Byberg',
  },
  description:
    "Notes from building with AI in production: multi-model orchestration, automating the boring parts, and forcing AI to fix its own mistakes.",
}

export default function BlogLayout({ children }) {
  return (
    <div className={`ai-root ${jetbrainsMono.variable}`}>{children}</div>
  )
}
