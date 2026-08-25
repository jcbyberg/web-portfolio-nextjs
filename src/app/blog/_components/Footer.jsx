import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="ai-footer">
      <span className="ai-mono-label">© {new Date().getFullYear()} Josh Byberg</span>
      <Link href="/" className="ai-mono-label">joshbyberg.com</Link>
    </footer>
  )
}
