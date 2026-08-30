"use client";

import Link from "next/link";
import Aurora from "../components/Aurora";
import EmailSection from "../components/EmailSection";
import "./landing.css";

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

// Josh's own live, verified properties — safe to link without third-party
// permission, and concrete evidence the work ships rather than a claim about
// it.
const proof = [
  {
    name: "Guitar Vault",
    blurb:
      "Next.js storefront for guitars, parts and accessories, with search, sorting and a full product catalogue.",
    url: "https://guitars.joshbyberg.com/",
    host: "guitars.joshbyberg.com",
  },
  {
    name: "Bourne To Climb",
    blurb:
      "Site for an Oshawa tree service — owner-operated, mobile-first, built to be found in local search.",
    url: "https://bournetoclimb.ca/",
    host: "bournetoclimb.ca",
  },
  {
    name: "Emet Bible",
    blurb:
      "A Hebrew and Greek interlinear Bible reader with an interactive verse graph — the biggest thing I've built, on a Python FastAPI and Postgres backend.",
    url: "https://emet-bible.com/",
    host: "emet-bible.com",
  },
];

export default function BringYourIdeaToLife({
  fontVars = "",
  brand = "josh",
}) {
  return (
    <div className={`byitl-root ${fontVars}`}>
      <Aurora palette="ember" intensity="subtle" />

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
          <section className="index-block" id="proof">
            <p className="spec section-label">03 &mdash; Proof</p>
            <h2>Work that&rsquo;s live, not mockups.</h2>

            <div className="index-head">
              <span className="spec">No.</span>
              <span className="spec">Project</span>
              <span className="spec">Visit</span>
            </div>

            {proof.map(({ name, blurb, url, host }, i) => (
              <a
                key={name}
                className="entry"
                href={url}
                target="_blank"
                rel="noreferrer"
              >
                <span className="entry-no">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <h3>{name}</h3>
                  <p>{blurb}</p>
                </div>
                <span className="entry-link">{host} &#8599;</span>
              </a>
            ))}
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
