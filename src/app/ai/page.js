import Link from 'next/link'
import { getAllPosts } from '@/lib/posts'
import ContactForm from './ContactForm'

// The section now has its own form, so nothing here links to the apex contact
// page. WHITESPACE_ORIGIN is still imported for the footer link in layout.js.

// Clients are described, not named. Every figure below is one that can be
// demonstrated on request — the vidx numbers are measured, and the rest are
// statements of what the pipelines do rather than claimed savings. Do not add
// an hours-saved or dollars-saved number here without a real one to back it.

function formatDate(iso) {
  return new Date(`${iso}T00:00:00`).toLocaleDateString('en-CA', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
  })
}

export default function AiPage() {
  // Three most recent only. /blog is the index; this is the doorway to it.
  const allPosts = getAllPosts('ai')
  const posts = allPosts.slice(0, 3)

  return (
    <>
      <section className="wsai-hero">
        <p className="wsai-eyebrow">
          Whitespace Design <span>/</span> automation
        </p>
        <h1>
          Your team should not spend Friday doing what a <strong>script</strong>{' '}
          can do by Tuesday.
        </h1>
        <p className="wsai-lede">
          I build automation for businesses with five to thirty staff — the ones
          where the same person doing the marketing is also doing the invoicing.
          Not chatbots. Working pipelines that take the repetitive production
          work off your team and hand back the week.
        </p>
        <div className="wsai-actions">
          <a className="wsai-cta" href="#contact">
            Tell me what is eating your week
          </a>
          <a className="wsai-cta-ghost" href="#work">
            See what I have built ↓
          </a>
        </div>
      </section>

      <section className="wsai-section" id="work">
        <div className="wsai-section-head">
          <span className="wsai-index">01</span>
          <h2>Marketing that ships without a coordinator</h2>
        </div>
        <p>
          A motorcycle dealer near Whitby sends regular email campaigns. The
          products, the prices and the images all live in the storefront
          already, so a person copying them into an email is a person
          transcribing a database by hand.
        </p>
        <p>
          The pipeline reads the storefront, builds the campaign against the
          approved layout, and leaves a draft waiting for approval.{' '}
          <strong>
            Nothing sends without a human saying so — that is deliberate.
          </strong>{' '}
          The same setup runs a racing team&rsquo;s social accounts: clips cut,
          captioned, scheduled, and partner accounts tagged from verified
          records rather than from memory.
        </p>
        <div className="wsai-figure">
          <div className="wsai-stat">
            <b>
              <em>1</em> source
            </b>
            <span>
              The storefront is the only place a price is typed. Email, social
              and the site all read from it, so they cannot disagree.
            </span>
          </div>
          <div className="wsai-stat">
            <b>
              <em>0</em> surprise sends
            </b>
            <span>
              Everything lands as a draft. Automation does the assembly; a
              person still decides what goes out the door.
            </span>
          </div>
        </div>
      </section>

      <section className="wsai-section">
        <div className="wsai-section-head">
          <span className="wsai-index">02</span>
          <h2>Footage that finds itself</h2>
        </div>
        <p>
          If you have ever paid an editor, you have paid for the hours they
          spent watching. Scrubbing a card of 4K clips to find the eight seconds
          worth using is billable time that produces nothing on its own.
        </p>
        <p>
          I built an indexer that watches it instead. It breaks each video into
          shots, transcribes the audio, reads numbers and text off the image,
          and writes the lot to a file you can search in plain language.{' '}
          <strong>
            A 604 MB 4K clip comes out the other side as a 1.3 KB index.
          </strong>{' '}
          You ask it where someone says a phrase, or where a number appears, and
          it hands back the timestamps.
        </p>
        <div className="wsai-figure">
          <div className="wsai-stat">
            <b>
              604 MB → <em>1.3 KB</em>
            </b>
            <span>
              One 4K clip reduced to a searchable index of shots, transcript and
              on-screen text. Measured, not estimated.
            </span>
          </div>
          <div className="wsai-stat">
            <b>
              <em>0</em> uploads
            </b>
            <span>
              Runs offline on an ordinary laptop. Client footage never leaves
              the building, and there is no per-minute cloud bill.
            </span>
          </div>
        </div>
      </section>

      <section className="wsai-section">
        <div className="wsai-section-head">
          <span className="wsai-index">03</span>
          <h2>Built around how you already work</h2>
        </div>
        <p>
          The automation that survives is the automation shaped to an existing
          process, not the one that demands you change to suit it. So I start by
          watching the job get done, find the part that is the same every time,
          and automate only that.
        </p>
        <p>
          What I build checks its own work and tells you when it is unsure,
          because a pipeline that fails silently is worse than no pipeline. It
          runs on your hardware where it can.{' '}
          <strong>
            And you get the source — this is your process, not a subscription
            you rent back from me.
          </strong>
        </p>
      </section>

      <section className="wsai-section" id="writing">
        <div className="wsai-section-head">
          <span className="wsai-index">04</span>
          <h2>Notes from the work itself</h2>
        </div>
        <p>
          What the tools actually cost, where they break, and what the
          automation looks like once it is running on real client work. Written
          for people who buy this stuff, not just people who build it.
        </p>
        <div className="wsai-writing">
          {posts.map((post) => (
            <Link key={post.slug} href={`/blog/${post.slug}`} className="wsai-post">
              <span className="wsai-post-date">{formatDate(post.date)}</span>
              <div>
                <h3>{post.title}</h3>
                <p>{post.excerpt}</p>
              </div>
            </Link>
          ))}
        </div>
        <Link className="wsai-more" href="/blog">
          Read all {allPosts.length} entries &rarr;
        </Link>
      </section>

      <section className="wsai-close" id="contact">
        <h2>What takes your team all week?</h2>
        <p>
          Tell me the job nobody wants on a Friday afternoon. If it is worth
          automating I will tell you how I would do it, and if it is not, I will
          tell you that instead — it is a short conversation either way.
        </p>
        <ContactForm />
      </section>
    </>
  )
}
