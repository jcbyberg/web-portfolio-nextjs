import { aiMono } from '@/app/fonts'
import './blog.css'

// Signature mono voice for the AI blog: labels, the trace-node markers,
// and code blocks. Exposed as a CSS variable per the CSS isolation
// contract (docs/superpowers/specs/2026-08-24-blogs-and-landing-design.md)
// — never a <link> tag, never applied outside .ai-root.

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
    <div className={`ai-root ${aiMono.variable}`}>{children}</div>
  )
}
