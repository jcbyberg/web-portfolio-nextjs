import Link from 'next/link'

export default function Cta() {
  return (
    <div className="ai-cta">
      <p className="ai-mono-label" style={{ marginBottom: '0.5rem', display: 'inline-block' }}>
        NEXT.RUN
      </p>
      <h2>Have an idea worth automating?</h2>
      <p>
        I build the same kind of systems this blog writes about — multi-model
        pipelines, automated data entry, and tools that fix their own mistakes.
        Tell me what&apos;s eating your team&apos;s time and I&apos;ll tell you
        if AI can take it off your plate.
      </p>
      <Link href="/bring-your-idea-to-life" className="ai-btn">
        Bring Your Idea to Life →
      </Link>
    </div>
  )
}
