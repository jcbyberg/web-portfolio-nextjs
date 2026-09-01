import Image from 'next/image'
import Link from 'next/link'

export default function Cta() {
  return (
    <div className="ai-cta">
      {/* The identity block the Race Dad index closes with (see
          src/app/race-dad/page.js) — a face and the mark, so the pitch at the
          foot of the page comes from a person rather than from the site. The
          two shared assets are reused as-is; only the treatment differs. The
          face is ringed in --ai-accent rather than Race Dad's maple red,
          because this blog is a console, not a pit board. */}
      <div className="ai-cta-id">
        <Image
          className="ai-cta-face"
          src="/images/hero-image.jpg"
          alt="Josh Byberg"
          width={112}
          height={112}
        />
        {/* Dark artwork, knocked out to white the same way Race Dad does it.
            alt is empty on purpose: the mark reads "Josh Byberg" and the face
            beside it already carries that name, so announcing it twice tells a
            screen-reader user nothing new. */}
        <Image
          className="ai-cta-logo"
          src="/images/logo.png"
          alt=""
          width={240}
          height={96}
        />
      </div>
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
