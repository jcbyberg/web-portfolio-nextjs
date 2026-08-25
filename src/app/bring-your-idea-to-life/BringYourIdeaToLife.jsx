"use client";

import Link from "next/link";
import Aurora from "../components/Aurora";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import EmailSection from "../components/EmailSection";
import {
  PaintBrushIcon,
  PrinterIcon,
  PresentationChartBarIcon,
  MegaphoneIcon,
  CpuChipIcon,
} from "@heroicons/react/24/outline";

// What Josh does, as five concrete service lines rather than a single vague
// "web design" bucket — this page has to land for three different audiences
// (design clients, racing programs, AI-automation clients), so each service
// needs to be nameable on its own.
const services = [
  {
    icon: PaintBrushIcon,
    title: "Web design & development",
    body: "Custom-built sites and web apps — React, Next.js, Python, WordPress and Shopify — designed for your business, not a template with your name dropped in.",
  },
  {
    icon: PrinterIcon,
    title: "Print collateral",
    body: "Business cards, brochures, signage and race-day materials, built to spec and ready for the printer — no guessing at trim, bleed or colour.",
  },
  {
    icon: PresentationChartBarIcon,
    title: "Trade show & event graphics",
    body: "Banners, booth panels and sponsor boards that hold up under show lighting and read clearly from across the aisle.",
  },
  {
    icon: MegaphoneIcon,
    title: "Social media",
    body: "Consistent, on-brand posts and graphics that keep a page active without eating your whole week — from a single race weekend to an ongoing content calendar.",
  },
  {
    icon: CpuChipIcon,
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
    linkLabel: "See design case studies",
  },
  {
    label: "Racing programs",
    title: "Mini-moto and race teams",
    body: "Sponsor decks, trailer graphics, social content and a race-season site that keeps sponsors visible and results easy to find.",
    href: "/race-dad",
    linkLabel: "Read the racing blog",
  },
  {
    label: "AI-automation clients",
    title: "Organizations drowning in manual work",
    body: "Automation that replaces the repetitive parts of your workflow — content, data, reporting — without replacing the judgment calls.",
    href: "/blog",
    linkLabel: "Read the AI blog",
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

export default function BringYourIdeaToLife() {
  return (
    <main className="relative min-h-screen text-[#16161A]">
      <Aurora palette="ember" intensity="full" />
      <div className="relative z-[1] flex min-h-screen flex-col">
        <Navbar />

        {/* ------------------------------------------------------------ HERO */}
        <section className="container mx-auto px-6 pt-32 pb-20 text-center sm:pt-40 sm:pb-28 lg:px-12">
          <span className="inline-flex items-center gap-2 rounded-full border border-[#FF6A00]/40 bg-[#FF6A00]/10 px-4 py-1.5 text-sm font-semibold text-[#B84D00]">
            Web design · print · trade show · social · AI automation
          </span>

          <h1 className="mx-auto mt-6 max-w-4xl text-4xl font-extrabold leading-tight text-[#16161A] sm:text-6xl lg:text-7xl">
            Bring Your{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF6A00] via-[#FF9E2C] to-[#FF6A00]">
              Idea
            </span>{" "}
            to Life
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg text-[#5C5C63] sm:text-xl">
            Design, print, and AI automation for small businesses, racing
            programs and organizations across Ontario — one person, start to
            finish, from the first sketch to the thing that ships.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="#contact"
              className="w-full rounded-full bg-gradient-to-r from-[#FF6A00] via-[#FF9E2C] to-[#FF6A00] px-8 py-4 text-lg font-semibold text-white shadow-lg shadow-[#FF6A00]/20 transition hover:brightness-110 sm:w-auto"
            >
              Start a project
            </Link>
            <Link
              href="#services"
              className="w-full rounded-full border border-[#DEDED8] bg-white/60 px-8 py-4 text-lg font-semibold text-[#16161A] backdrop-blur transition hover:border-[#FF6A00] sm:w-auto"
            >
              See what I do
            </Link>
          </div>
        </section>

        {/*
          "Who this is for" / "What I do" / "Work that's live" sit past the
          hero, where the fixed Aurora canvas (pinned to the viewport) no
          longer shows any blob nearby — without help the page flattens to
          plain grey-white here before the hard cut to the near-black contact
          band. A subtle warm gradient wash carries the ember identity
          through, easing from transparent (still inside the hero's glow)
          into a soft cream that hands off to the contact band's warm dark
          ground below. Kept deliberately light: text contrast against it is
          the same as against white.
        */}
        <div className="bg-gradient-to-b from-transparent via-[#FFEEDC] to-[#FFDFB8]">
        {/* --------------------------------------------------------- AUDIENCE */}
        <section id="who" className="container mx-auto px-6 py-16 lg:px-12">
          <h2 className="text-center text-3xl font-bold text-[#16161A] sm:text-4xl">
            Who this is for
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-center text-[#5C5C63]">
            Three different worlds, one person building for all of them.
          </p>

          <div className="mx-auto mt-10 grid max-w-6xl gap-6 md:grid-cols-3">
            {audiences.map(({ label, title, body, href, linkLabel }) => (
              <div
                key={title}
                className="flex flex-col rounded-xl border border-[#DEDED8] bg-white/70 p-6 shadow-sm backdrop-blur"
              >
                <span className="text-xs font-bold uppercase tracking-[0.15em] text-[#B84D00]">
                  {label}
                </span>
                <h3 className="mt-2 text-xl font-bold text-[#16161A]">
                  {title}
                </h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-[#5C5C63]">
                  {body}
                </p>
                <Link
                  href={href}
                  className="mt-4 inline-block text-sm font-semibold text-[#B84D00] hover:text-[#FF6A00]"
                >
                  {linkLabel} →
                </Link>
              </div>
            ))}
          </div>
        </section>

        {/* --------------------------------------------------------- SERVICES */}
        <section id="services" className="container mx-auto px-6 py-16 lg:px-12">
          <h2 className="text-center text-3xl font-bold text-[#16161A] sm:text-4xl">
            What I do
          </h2>
          <div className="mx-auto mt-10 grid max-w-6xl gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {services.map(({ icon: Icon, title, body }) => (
              <div
                key={title}
                className="rounded-xl border border-[#DEDED8] bg-white/70 p-6 shadow-sm backdrop-blur"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-[#FF6A00] to-[#FF9E2C]">
                  <Icon className="h-6 w-6 text-white" />
                </span>
                <h3 className="mt-4 font-semibold text-[#16161A]">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[#5C5C63]">
                  {body}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ------------------------------------------------------------ PROOF */}
        <section id="proof" className="container mx-auto px-6 py-16 lg:px-12">
          <h2 className="text-center text-3xl font-bold text-[#16161A] sm:text-4xl">
            Work that&apos;s live
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-center text-[#5C5C63]">
            Real, running sites — not mockups.
          </p>
          <div className="mx-auto mt-10 grid max-w-5xl gap-6 sm:grid-cols-3">
            {proof.map(({ name, blurb, url, host }) => (
              <div
                key={name}
                className="rounded-xl border border-[#DEDED8] bg-white/70 p-6 shadow-sm backdrop-blur"
              >
                <h3 className="font-bold text-[#16161A]">{name}</h3>
                <p className="mt-1 text-sm text-[#5C5C63]">{blurb}</p>
                <Link
                  href={url}
                  className="mt-4 inline-block text-sm font-semibold text-[#B84D00] hover:text-[#FF6A00]"
                >
                  {host} →
                </Link>
              </div>
            ))}
          </div>
        </section>
        </div>

        {/*
          CONTACT + FOOTER share this dark wrapper. Footer's white/slate text
          has no background of its own (it relies on the homepage's dark
          <main>), so on this light ember page it must stay inside a dark
          container or it renders unreadable white-on-white.

          Ground is a warm near-black (not #121212) that continues straight
          on from the cream wash above, so the hand-off from "light, airy"
          to "dark contact band" reads as one warm surface rather than a cut
          to a cold, unrelated black.
        */}
        <div className="mt-0 bg-gradient-to-b from-[#3A1F0E] via-[#20140D] to-[#171210]">
          <section id="contact">
            <div className="container mx-auto px-12 py-4">
              <EmailSection variant="ember" />
            </div>
          </section>
          <Footer />
        </div>
      </div>
    </main>
  );
}
