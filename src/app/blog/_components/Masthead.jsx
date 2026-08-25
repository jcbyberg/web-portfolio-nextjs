import Link from 'next/link'

export default function Masthead() {
  return (
    <header className="ai-masthead">
      <Link href="/blog" className="ai-wordmark">
        <span className="ai-node is-live">AI.LOG</span>
        Josh Byberg
      </Link>
      <nav>
        <Link href="/">Home</Link>
        <Link href="/bring-your-idea-to-life">Work With Me</Link>
      </nav>
    </header>
  )
}
