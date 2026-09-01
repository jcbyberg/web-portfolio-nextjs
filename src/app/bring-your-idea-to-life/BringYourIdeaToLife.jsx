"use client";

import Link from "next/link";
import Aurora from "../components/Aurora";
import EmailSection from "../components/EmailSection";
import { BOURNE_QUOTE_APPROVED } from "../oshawa/offer-config";
import "./landing.css";

// One switch governs every published use of Dustin Bourne's site, exactly as
// offer-config.js says it must: flipping BOURNE_QUOTE_APPROVED to false removes
// the screenshot from /oshawa, from the projects section AND from here, rather
// than leaving this page to be found by hand later.

// What Josh does, as five concrete service lines rather than a single vague
// "web design" bucket — this page has to land for three different audiences
// (design clients, racing programs, AI-automation clients), so each service
// needs to be nameable on its own.
const services = [
  {
    title: "Web design & development",
    body: "Custom-built sites and web apps — React, Next.js, Python, WordPress and Shopify — designed for your business, not a template with your name dropped in.",
  },
  {
    title: "Print collateral",
    body: "Business cards, brochures, signage and race-day materials, built to spec and ready for the printer — no guessing at trim, bleed or colour.",
  },
  {
    title: "Trade show & event graphics",
    body: "Banners, booth panels and sponsor boards that hold up under show lighting and read clearly from across the aisle.",
  },
  {
    title: "Social media",
    body: "Consistent, on-brand posts and graphics that keep a page active without eating your whole week — from a single race weekend to an ongoing content calendar.",
  },
  {
    title: "AI automation",
    body: "Practical AI workflows that take repetitive work off your plate — content pipelines, data entry, reporting — built and handed over, not left as a black box.",
  },
];

// Three audiences, tied to the three blogs that funnel here, without turning
// the page into three separate mini-sites. Each links onward to the blog
// that speaks that audience's language in more depth.
const audiences = [
  {
    label: "Design clients",
    title: "Small businesses across Ontario",
    body: "A site, a brand, or print materials that make you look as sharp as the work you actually do — built and optimized for local and AI search.",
    href: "/whitespace",
    linkLabel: "Whitespace",
    linkDescription: "See design case studies on Whitespace",
  },
  {
    label: "Racing programs",
    title: "Mini-moto and race teams",
    body: "Sponsor decks, trailer graphics, social content and a race-season site that keeps sponsors visible and results easy to find.",
    href: "/race-dad",
    linkLabel: "Race Dad",
    linkDescription: "Read the racing blog, Race Dad",
  },
  {
    label: "AI-automation clients",
    title: "Organizations drowning in manual work",
    body: "Automation that replaces the repetitive parts of your workflow — content, data, reporting — without replacing the judgment calls.",
    href: "/blog",
    linkLabel: "AI blog",
    linkDescription: "Read the AI blog",
  },
];

// The one build shown as proof. This section says "live, not mockups", so
// every entry has to actually be live — that is the whole claim, and a visitor
// checks it with one click.
//
// Guitar Vault and Emet Bible were removed on 2026-09-01 because they were not:
// guitars.joshbyberg.com returned 502 Bad Gateway, and emet-bible.com served its
// shell while every API call (/v1/verses/…, the graph and galaxy endpoints)
// returned 500, so the interactive verse graph it advertised did nothing.
// Put either back only after confirming a real request succeeds — loading the
// homepage is not sufficient for Emet, whose shell renders fine while broken.
//
// Bourne To Climb usage — the name, the link, the screenshot and the
// client-reported outcome — is bounded by the permission register at
// D:/moneymaker/data/permissions/bourne-to-climb.md. Read it before changing a
// word here. Two limits that are easy to trip:
//   - No ranking or SEO-outcome language anywhere (oshawa-outreach.md §11), and
//     no causation claims. Describe the deliverable, never the result.
//   - The outcome is a client's paraphrased report and must carry the
//     client-reported + not-independently-verified marking on EVERY use.
//     Dustin's verbatim quote is scoped to /oshawa and is deliberately not
//     reused here; his plans for the business are private and stay off the site.
const proof = {
  name: "Bourne To Climb",
  blurb:
    "Site for an Oshawa tree service — owner-operated, mobile-first, built so the phone number is the easiest thing on the page.",
  url: "https://bournetoclimb.ca/",
  host: "bournetoclimb.ca",
  // The same approved 2026-08-14 homepage capture, with the browser scrollbar
  // cropped off the right edge — at this size the original's scrollbar reads as
  // a grey stripe inside the keyline. A derivative rather than an edit in place,
  // because /oshawa and the projects section share the original file.
  shot: "/images/projects/bourne-to-climb-proof.jpg",
  // Names the link's destination, not the picture — see the note at the <img>.
  shotAlt: "Bourne To Climb — open the live site",
  report:
    "Dustin Bourne reports the business now takes more work than his crew can get through.",
  caveat:
    "His account, told to me directly. I have not audited his call volume, and no result here is promised to anyone else.",
};

export default function BringYourIdeaToLife({
  fontVars = "",
  brand = "josh",
}) {
  return (
    <div className={`byitl-root ${fontVars}`}>
      {/* Rose rather than ember: the orange wash sat too close to the body
          copy to read comfortably. Rose is paler, blurred wider and tracks the
          pointer further, so it reads as tinted stock behind the type instead
          of a layer on top of it. The ember accent (--accent) stays — it is
          the page's one accent colour and is unrelated to the background. */}
      <Aurora palette="rose" intensity="subtle" />

      <div className="sheet-marks" aria-hidden="true">
        <span className="tl"></span>
        <span className="tr"></span>
        <span className="bl"></span>
        <span className="br"></span>
      </div>

      <div className="wrap">
        {/* ---------------------------------------------------- MASTHEAD */}
        {/* This page renders its own light masthead instead of the global
            dark Navbar, same mechanism the /whitespace section uses — a
            dark bar on a flat cream press sheet reads as a foreign object.
            The wordmark and "Home" link are the way back to the rest of
            the site. */}
        <header className="masthead">
          {brand === "whitespace" ? (
            <>
              <Link className="wordmark" href="/whitespace">
                White<em aria-hidden="true"></em>space Design
              </Link>
              <nav>
                <Link className="is-home" href="/whitespace">
                  Work
                </Link>
                <Link href="/whitespace/about">About</Link>
                <Link href="/hire-me">Hire me</Link>
              </nav>
            </>
          ) : (
            <>
              <Link className="wordmark" href="/">
                Josh<em aria-hidden="true"></em>Byberg
              </Link>
              <nav>
                <Link className="is-home" href="/">
                  Home
                </Link>
                <Link href="/whitespace">Design</Link>
                <Link href="/race-dad">Racing</Link>
                <Link href="/blog">Blog</Link>
              </nav>
            </>
          )}
        </header>

        <main>
          {/* -------------------------------------------------------- HERO */}
          <section className="hero">
            <p className="spec">Available for work &middot; Ontario</p>
            <h1>Bring your idea to life.</h1>
            <div className="hero-rule" aria-hidden="true"></div>
            <p className="lede">
              I design print, web and automation for people who get one shot
              at it.
            </p>
            <div className="cta">
              <a className="btn" href="#contact">
                Start a project &darr;
              </a>
            </div>
          </section>

          <div className="colourbar" aria-hidden="true">
            <i></i>
            <i></i>
            <i></i>
            <i></i>
          </div>

          {/* ----------------------------------------------------- AUDIENCE */}
          <section className="index-block" aria-label="Who this is for">
            <p className="spec section-label">01 &mdash; Who it&rsquo;s for</p>
            <h2 className="byitl-sr-only">Who it&rsquo;s for</h2>
            <div className="index-head">
              <span className="spec">No.</span>
              <span className="spec">Who it&rsquo;s for</span>
              <span className="spec">See more</span>
            </div>

            {audiences.map(
              ({ label, title, body, href, linkLabel, linkDescription }, i) => {
                // /race-dad and /blog live only on joshbyberg.com. On the
                // whitespace brand they are cross-origin, and a next/link
                // prefetch of their RSC payload is blocked by CORS - six
                // console errors and two wasted requests per page load. A
                // plain anchor to the absolute URL avoids the prefetch
                // entirely. On the josh brand they stay same-origin links.
                const foreign = href === "/race-dad" || href === "/blog";
                const external = brand === "whitespace" && foreign;
                const Tag = external ? "a" : Link;
                const target = external ? `https://joshbyberg.com${href}` : href;

                return (
                  <Tag
                    key={title}
                    className="entry"
                    href={target}
                    aria-label={linkDescription}
                  >
                    <span className="entry-no">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <div>
                      <span className="entry-tag">{label}</span>
                      <h3>{title}</h3>
                      <p>{body}</p>
                    </div>
                    <span className="entry-link">{linkLabel}</span>
                  </Tag>
                );
              },
            )}
          </section>

          {/* ----------------------------------------------------- SERVICES */}
          <section className="index-block" id="services">
            <p className="spec section-label">02 &mdash; What I do</p>
            <h2>Five ways to get this done.</h2>

            <div className="index-head">
              <span className="spec">No.</span>
              <span className="spec">Service</span>
              <span className="spec"></span>
            </div>

            {services.map(({ title, body }, i) => (
              <div key={title} className="entry">
                <span className="entry-no">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <h3>{title}</h3>
                  <p>{body}</p>
                </div>
                <span></span>
              </div>
            ))}
          </section>

          {/* -------------------------------------------------------- PROOF */}
          {/* In print, a proof is the sheet you pull off the press and check
              before committing to the run — so the one live build on this page
              is presented as exactly that, rather than as a card in a grid.
              The numbered index rhythm used by the two sections above is
              deliberately dropped here: a number encodes a sequence, and one
              item is not a sequence. */}
          <section className="proof-block" id="proof">
            <p className="spec section-label">
              03 &mdash; Proof &middot; live, not mockups
            </p>
            <h2>{proof.name}</h2>
            <p className="proof-lede">{proof.blurb}</p>

            {/* Two structures rather than one with a hole in it. With the
                screenshot present this is a figure captioned by the report;
                with it withdrawn there is nothing left to caption, and a
                <figure> holding only a <figcaption> is neither valid nor
                laid out correctly — the caption would inherit the plate's
                60% grid column and sit beside empty space. The gated-off
                branch is a plain block that owns its own link. */}
            {BOURNE_QUOTE_APPROVED ? (
              <figure className="press-proof">
                <a
                  className="press-proof-plate"
                  href={proof.url}
                  target="_blank"
                  rel="noreferrer"
                >
                  {/* The image IS the link, so its alt names the destination
                      rather than describing the picture: alt text and the
                      visible host label concatenate into one accessible name,
                      and a 40-word description of the screenshot made that
                      name unusable. What the site looks like is carried by the
                      lede above, which every reader gets.
                      Width/height are the capture's real intrinsic size, so
                      the space is reserved before it loads. */}
                  <img
                    src={proof.shot}
                    alt={proof.shotAlt}
                    width="1264"
                    height="720"
                    decoding="async"
                  />
                  <span className="press-proof-visit">
                    {proof.host} &#8599;
                  </span>
                </a>

                <figcaption>
                  <p className="spec">Client-reported</p>
                  <p className="proof-report">{proof.report}</p>
                  <p className="proof-caveat">{proof.caveat}</p>
                </figcaption>
              </figure>
            ) : (
              <div className="proof-note">
                <p className="spec">Client-reported</p>
                <p className="proof-report">{proof.report}</p>
                <p className="proof-caveat">{proof.caveat}</p>
                <a
                  className="proof-fallback-link"
                  href={proof.url}
                  target="_blank"
                  rel="noreferrer"
                >
                  {proof.host} &#8599;
                </a>
              </div>
            )}
          </section>

          {/* ------------------------------------------------------ CONTACT */}
          <section className="contact-block">
            <p className="spec section-label">04 &mdash; Start a project</p>
            <EmailSection variant="ember" />
          </section>
        </main>

        <footer className="site">
          {brand === "whitespace" ? (
            <span className="spec">Whitespace Design &mdash; Josh Byberg</span>
          ) : (
            <span className="spec">
              Josh Byberg &mdash; Design, print &amp; automation
            </span>
          )}
          <span className="spec">joshbyberg.com</span>
        </footer>
      </div>
    </div>
  );
}
