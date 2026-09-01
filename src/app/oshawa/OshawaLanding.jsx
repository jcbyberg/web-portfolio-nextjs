"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import Aurora from "../components/Aurora";
import {
  MapPinIcon,
  CheckIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";

import {
  OFFER_END_DATE,
  OFFER_END_ISO,
  SLOTS_AVAILABLE,
  BOURNE_QUOTE_APPROVED,
  BOURNE_TESTIMONIAL,
  CONTACT_EMAIL,
  SERVICE_AREA,
} from "./offer-config";

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.5 },
};

const GradientText = ({ children }) => (
  <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-cyan-300 to-blue-600">
    {children}
  </span>
);

const Blocker = ({ children }) => (
  <span className="inline-flex items-start gap-2 rounded-md border border-amber-500 bg-amber-500/10 px-3 py-2 text-sm font-semibold text-amber-300">
    <ExclamationTriangleIcon className="mt-0.5 h-4 w-4 shrink-0" />
    <span>{children}</span>
  </span>
);

// Everything in the package. Wording describes DELIVERABLES only — no ranking,
// position, or outcome claims (docs/campaign/oshawa-outreach.md, PLAN §11).
const packageIncludes = [
  {
    title: "A new site, or a rebuild of your current one",
    body: "Starting from nothing or replacing a site that has dated badly — same price either way. Designed for your business specifically, not a template with your name dropped into it. Up to five sections covering your services, your work, your service area, and how to reach you.",
  },
  {
    title: "Optimized for web search",
    body: "Concretely: your business name, address and phone written into the page as schema.org LocalBusiness structured data, so Google reads them as facts instead of guessing from your text. A title and description written for each page rather than left as the default. A sitemap so nothing gets missed when your site is crawled. The areas you serve named in the copy where they belong. All of it checked against Google's own structured-data testing tool before launch — not just built and hoped over.",
  },
  {
    title: "Optimized for AI search",
    body: "More people now ask ChatGPT and Google's AI answers for a local business instead of scrolling a results page. Your site gets schema.org structured data and clean, semantic markup, so those systems can actually read what you do, where you work, and how to reach you — instead of guessing.",
  },
  {
    title: "Heavily optimized to load fast",
    body: "Performance and accessibility checked before launch. A slow site loses people before it finishes loading. Yours won't.",
  },
  {
    title: "Mobile-first, because that's where your customers are",
    body: "Clear and quick on a phone, with tap-to-call and a contact or quote form that works on the first try.",
  },
  {
    title: "Makes you look the part",
    body: "A sharp, professional site puts you on level footing with the next business a customer is comparing you to.",
  },
  {
    title: "Set up and handed over",
    body: "Accessibility and performance checked before launch, analytics handed to you, and the site is yours.",
  },
  {
    title: "Two revision rounds",
    body: "Nothing goes live without your sign-off. Fixed scope, fixed price, written scope of work before any money changes hands.",
  },
];

// Other live builds shown under the lead client site. All verified reachable
// 2026-08-14; these are Josh's own properties, so no third-party permission
// applies to naming or linking them.
const otherSites = [
  {
    name: "Small Business Blog",
    blurb:
      "A blog for a small business with no CMS behind it — nothing to log into, nothing to pay for monthly, and articles that are quick to publish.",
    url: "https://nextjs-portfolio-woad-iota.vercel.app/",
    host: "nextjs-portfolio-woad-iota.vercel.app",
  },
];

const steps = [
  ["Book it", "Sign the one-page scope of work and pay half up front."],
  ["Send your content", "A short form collects your services, photos, service area, and contact details."],
  ["Build", "Your page gets built from your content and licensed assets only."],
  ["Review", "Two revision rounds, then your final approval."],
  ["Launch", "Live within five business days of content approval."],
];

const notIncluded =
  "Domain registration or transfer, ecommerce or online stores, custom booking systems, multilingual content, logo and brand design, photography, unlimited edits, substantial copywriting, and any ongoing SEO or content work. Need one of these? Say so up front and you'll get a separate quote before anything starts.";

/**
 * Whether the promotion has closed.
 *
 * Evaluated on the client after mount, not during render: the page is
 * statically generated, so a build-time comparison would freeze whatever was
 * true the day it was deployed, and comparing during render would produce a
 * hydration mismatch. Starts false so the server and first client render agree.
 */
function useOfferExpired() {
  const [expired, setExpired] = useState(false);
  useEffect(() => {
    if (!OFFER_END_ISO) return;
    const end = new Date(OFFER_END_ISO).getTime();
    if (Number.isNaN(end)) return;
    setExpired(Date.now() > end);
  }, []);
  return expired;
}

export default function OshawaLanding() {
  const offerExpired = useOfferExpired();

  return (
    <main className="min-h-screen bg-[#121212] text-white">
      <Aurora intensity="subtle" />
      <div className="relative z-[1]">
      {/*
        Reveal animations start at opacity:0 and are un-hidden by framer-motion
        once IntersectionObserver fires. Without JS that never happens, so force
        every animated element visible when scripting is unavailable.
      */}
      <noscript>
        {/*
          dangerouslySetInnerHTML is required here, not decoration: as JSX text
          React escapes the quotes to &quot;, and a <style> element's contents
          are raw CSS where entities are NOT decoded — the selector becomes
          invalid and matches nothing, leaving the page blank without JS.
        */}
        <style
          dangerouslySetInnerHTML={{
            __html:
              '[style*="opacity:0"]{opacity:1!important;transform:none!important}',
          }}
        />
      </noscript>

      {/* ------------------------------------------------------------- HERO */}
      <section className="relative overflow-hidden">
        <div className="relative container mx-auto px-6 py-20 text-center sm:py-28 lg:px-12">
          <motion.div {...fadeUp}>
            <span className="inline-flex items-center gap-2 rounded-full border border-cyan-400/40 bg-cyan-400/10 px-4 py-1.5 text-sm font-semibold text-cyan-300">
              <MapPinIcon className="h-4 w-4" />
              Oshawa &amp; Durham Region businesses only
            </span>

            <h1 className="mx-auto mt-6 max-w-4xl text-4xl font-extrabold leading-tight sm:text-6xl lg:text-7xl">
              The <GradientText>$500</GradientText> Website Package
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-lg text-[#ADB7BE] sm:text-xl">
              A new website, or a rebuild of the one you already have.
              Clean, custom, heavily optimized, built to be found in local
              search — live in five business days. One fixed price, no
              surprises.
            </p>

            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href="#package"
                className="w-full rounded-full bg-gradient-to-r from-sky-500 via-cyan-400 to-blue-600 px-8 py-4 text-lg font-semibold text-white transition hover:from-sky-400 hover:via-cyan-300 hover:to-blue-500 sm:w-auto"
              >
                See what&apos;s included
              </Link>
              <Link
                href="#work"
                className="w-full rounded-full border border-[#33353F] px-8 py-4 text-lg font-semibold text-[#ADB7BE] transition hover:border-white hover:text-white sm:w-auto"
              >
                See a local site I built
              </Link>
            </div>

            {offerExpired ? (
              <p className="mt-8 text-sm text-[#ADB7BE]">
                This promotion closed on{" "}
                <span className="font-semibold text-white">
                  {OFFER_END_DATE}
                </span>
                . Get in touch anyway — I&apos;ll tell you what a site would
                cost today.
              </p>
            ) : OFFER_END_DATE ? (
              <p className="mt-8 text-sm text-[#ADB7BE]">
                Available on work booked by{" "}
                <span className="font-semibold text-white">
                  {OFFER_END_DATE}
                </span>
                {SLOTS_AVAILABLE ? (
                  <>
                    {" "}
                    ·{" "}
                    <span className="font-semibold text-white">
                      {SLOTS_AVAILABLE}
                    </span>{" "}
                    builds available in that window
                  </>
                ) : null}
              </p>
            ) : (
              <div className="mt-8 flex justify-center">
                <Blocker>
                  Set OFFER_END_DATE in offer-config.js — no deadline is shown
                  until a real one is supplied
                </Blocker>
              </div>
            )}
          </motion.div>
        </div>
      </section>

      {/* ---------------------------------------------------------- PACKAGE */}
      <section id="package" className="container mx-auto px-6 pb-8 lg:px-12">
        <motion.div
          {...fadeUp}
          className="mx-auto max-w-5xl overflow-hidden rounded-2xl border border-cyan-400/30 bg-[#181818]"
        >
          {/* price header */}
          <div className="border-b border-[#33353F] bg-gradient-to-r from-sky-500/10 via-cyan-400/10 to-blue-600/10 px-8 py-8 text-center">
            <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-cyan-300">
              Website Package
            </h2>
            <p className="mt-3 text-6xl font-extrabold sm:text-7xl">
              <GradientText>$500</GradientText>
              <span className="ml-3 align-middle text-2xl font-semibold text-[#ADB7BE]">
                + HST
              </span>
            </p>
            <p className="mt-2 text-[#ADB7BE]">
              CAD, fixed price. Half to book, half on approval before launch.
            </p>
          </div>

          {/* inclusions */}
          <div className="grid gap-x-10 gap-y-7 px-8 py-10 md:grid-cols-2">
            {packageIncludes.map(({ title, body }) => (
              <div key={title} className="flex gap-4">
                <span className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gradient-to-r from-sky-500 to-blue-600">
                  <CheckIcon className="h-4 w-4 text-white" strokeWidth={3} />
                </span>
                <div>
                  <h3 className="font-semibold text-white">{title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-[#ADB7BE]">
                    {body}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* cta */}
          <div className="border-t border-[#33353F] px-8 py-8 text-center">
            <Link
              href={`mailto:${CONTACT_EMAIL}?subject=Oshawa%20%24500%20website%20package`}
              className="inline-block w-full rounded-full bg-gradient-to-r from-sky-500 via-cyan-400 to-blue-600 px-8 py-4 text-lg font-semibold text-white transition hover:from-sky-400 hover:via-cyan-300 hover:to-blue-500 sm:w-auto"
            >
              Claim a spot
            </Link>
            <p className="mt-3 text-sm text-[#ADB7BE]">
              Email {CONTACT_EMAIL} — tell me what your business does and where
              you are.
            </p>
          </div>
        </motion.div>

        <motion.div
          {...fadeUp}
          className="mx-auto mt-6 max-w-5xl rounded-xl border border-[#33353F] bg-[#181818]/60 p-6"
        >
          <h3 className="font-semibold">What costs extra</h3>
          <p className="mt-2 text-sm leading-relaxed text-[#ADB7BE]">
            {notIncluded}
          </p>
        </motion.div>
      </section>

      {/* ------------------------------------------------------- LOCAL PROOF */}
      <section id="work" className="container mx-auto px-6 py-16 lg:px-12">
        <motion.h2
          {...fadeUp}
          className="text-center text-3xl font-bold sm:text-4xl"
        >
          Sites I&apos;ve <GradientText>built</GradientText>
        </motion.h2>

        {/* Lead item: the local client site. */}
        <motion.div
          {...fadeUp}
          className="mx-auto mt-10 max-w-3xl rounded-xl border border-cyan-400/30 bg-[#181818] p-8"
        >
          <span className="text-xs font-bold uppercase tracking-[0.15em] text-cyan-300">
            Local client
          </span>
          <h3 className="mt-2 text-2xl font-bold">
            Bourne To Climb — Oshawa
          </h3>
          <p className="mt-1 text-[#ADB7BE]">
            Owner-operated tree service. Owner: Dustin Bourne.
          </p>

          {/*
            Screenshot of the client's live site. Published under the owner's
            approval confirmed 2026-08-14 (tier 3) — see
            data/permissions/bourne-to-climb.md.
          */}
          {BOURNE_QUOTE_APPROVED ? (
            <div className="mt-6 overflow-hidden rounded-lg border border-[#33353F]">
              <Image
                src="/images/projects/bourne-to-climb.jpg"
                alt="The Bourne To Climb website homepage"
                width={1280}
                height={720}
                sizes="(max-width: 768px) 100vw, 640px"
                className="h-auto w-full"
              />
            </div>
          ) : null}

          {/*
            Tier 2 (verbal permission): the owner's report, attributed and
            explicitly unverified. NO quotation marks and NOT presented as his
            words — data/permissions/bourne-to-climb.md forbids both until
            written permission is stored. Tier 3 below replaces this.
          */}
          {BOURNE_QUOTE_APPROVED && BOURNE_TESTIMONIAL ? (
            <blockquote className="mt-6 border-l-4 border-cyan-400 pl-6 text-lg italic text-white">
              {BOURNE_TESTIMONIAL}
              <footer className="mt-2 text-sm not-italic text-[#ADB7BE]">
                — Dustin Bourne, Bourne To Climb
              </footer>
            </blockquote>
          ) : (
            <div className="mt-6 border-l-4 border-cyan-400 pl-6">
              <p className="text-lg text-white">
                Since the site launched, the owner reports the business has had
                more work leads than it can handle.
              </p>
              <p className="mt-2 text-sm text-[#ADB7BE]">
                Reported by Dustin Bourne, the owner. Not independently
                verified, and not a result promised to anyone else.
              </p>
            </div>
          )}

          <Link
            href="https://bournetoclimb.ca/"
            className="mt-6 inline-block rounded-full border border-cyan-400/40 px-6 py-3 font-semibold text-cyan-300 transition hover:border-cyan-300 hover:text-white"
          >
            Visit bournetoclimb.ca →
          </Link>

          {!BOURNE_QUOTE_APPROVED ? (
            <div className="mt-6">
              <Blocker>
                A quoted testimonial and site screenshots stay off this page
                until Dustin&apos;s WRITTEN permission is stored (tier 3 locked
                — data/permissions/bourne-to-climb.md)
              </Blocker>
            </div>
          ) : null}
        </motion.div>

        {/* Other live builds. */}
        <div className="mx-auto mt-6 grid max-w-3xl gap-6 sm:grid-cols-2">
          {otherSites.map(({ name, blurb, url, host }) => (
            <motion.div
              key={name}
              {...fadeUp}
              className="rounded-xl border border-[#33353F] bg-[#181818] p-6"
            >
              <h3 className="text-lg font-bold">{name}</h3>
              <p className="mt-1 text-sm text-[#ADB7BE]">{blurb}</p>
              <Link
                href={url}
                className="mt-4 inline-block text-sm font-semibold text-cyan-300 hover:text-white"
              >
                {host} →
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ------------------------------------------------------------ PROCESS */}
      <section className="container mx-auto px-6 py-16 lg:px-12">
        <motion.h2
          {...fadeUp}
          className="text-center text-3xl font-bold sm:text-4xl"
        >
          How it <GradientText>works</GradientText>
        </motion.h2>
        <ol className="mx-auto mt-10 grid max-w-6xl gap-6 md:grid-cols-5">
          {steps.map(([title, body], i) => (
            <motion.li
              key={title}
              {...fadeUp}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className="rounded-xl border border-[#33353F] bg-[#181818] p-6"
            >
              <span className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-blue-600">
                {i + 1}
              </span>
              <h3 className="mt-2 font-semibold">{title}</h3>
              <p className="mt-2 text-sm text-[#ADB7BE]">{body}</p>
            </motion.li>
          ))}
        </ol>
      </section>

      {/* ------------------------------------------------------ WHO QUALIFIES */}
      <section className="container mx-auto px-6 py-16 lg:px-12">
        <motion.div
          {...fadeUp}
          className="mx-auto max-w-4xl rounded-xl border border-cyan-400/30 bg-gradient-to-br from-[#181818] to-[#121212] p-8 text-center"
        >
          <h2 className="text-2xl font-bold sm:text-3xl">
            For <GradientText>local businesses</GradientText> only
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-[#ADB7BE]">
            This price is for businesses in and around Oshawa. If I can drive to
            you, you qualify.
          </p>
          <ul className="mt-6 flex flex-wrap justify-center gap-2">
            {SERVICE_AREA.map((city) => (
              <li
                key={city}
                className="rounded-full border border-[#33353F] px-4 py-1.5 text-sm text-white"
              >
                {city}
              </li>
            ))}
          </ul>
        </motion.div>
      </section>

      {/* ------------------------------------------------------------ FOOTER */}
      <footer className="border-t border-[#33353F]">
        <div className="container mx-auto px-6 py-10 text-sm text-[#ADB7BE] lg:px-12">
          <p>
            Josh Byberg — web developer, Oshawa, Ontario.{" "}
            <Link href="/" className="text-cyan-300 hover:text-white">
              joshbyberg.com
            </Link>
          </p>
          <p className="mt-3 max-w-3xl">
            The Bourne To Climb outcome above is the business owner&apos;s own
            report, used with his permission. It has not been independently
            verified, and no similar result is promised or implied for any other
            business.
          </p>
        </div>
      </footer>
      </div>
    </main>
  );
}
