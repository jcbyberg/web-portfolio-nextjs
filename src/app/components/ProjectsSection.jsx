"use client";
import React, { useState, useRef } from "react";
import ProjectCard from "./ProjectCard";
import ProjectTag from "./ProjectTag";
import { motion, useInView } from "framer-motion";
import { BOURNE_QUOTE_APPROVED } from "../oshawa/offer-config";

const projectsData = [
  {
    id: 0,
    title: "Bourne To Climb",
    description:
      "A one-page site for an owner-operated tree service here in Oshawa. Built for the phone, because that's where people look for one.",
    features: [
      "Highly optimized local SEO",
      "schema.org structured data — readable by Google and AI assistants",
      // Deliverable only. docs/campaign/oshawa-outreach.md §11 forbids ranking
      // and SEO-outcome language sitewide, and that covers phrasing like
      // "improve your visibility" as well as outright ranking claims —
      // "optimized for" describes work done, "improve your X" promises a
      // result. Keep this bullet naming artifacts, not effects.
      "Written page title, meta description, and sitemap — not left as defaults",
      "Mobile-first — built for customers calling from a phone",
      "Tap-to-call and quote requests",
      "Performance and accessibility checked before launch",
    ],
    // Screenshot of the client's live site, permission-gated exactly like
    // /oshawa: if approval is ever withdrawn, flipping BOURNE_QUOTE_APPROVED
    // removes it here too, not only from the offer page
    // (data/permissions/bourne-to-climb.md).
    image: BOURNE_QUOTE_APPROVED ? "/images/projects/bourne-to-climb.jpg" : null,
    tag: ["All", "Web"],
    gitUrl: "",
    previewUrl: "https://bournetoclimb.ca/",
  },
  {
    id: 2,
    title: "Shopify Demo Store",
    description:
      "A real Shopify store you can walk through before deciding whether Shopify is right for you. The password is 1234.",
    features: [
      "Custom Shopify theme work",
      "Mobile-first storefront",
      "Product and collection layouts",
    ],
    image: "/images/projects/1.jpg",
    tag: ["All", "Web"],
    gitUrl: "https://github.com/jcbyberg/notus-nextjs",
    previewUrl: "https://lorem-soap.myshopify.com/",
  },
  {
    id: 3,
    title: "Customized Portfolio Template",
    description:
      "An off-the-shelf template reworked until it stopped looking off-the-shelf.",
    features: [
      "Custom rebrand of a Next.js template",
      "Responsive across desktop and mobile",
      "Reusable component library",
    ],
    image: "/images/projects/2.jpg",
    tag: ["All", "Web"],
    gitUrl: "https://github.com/jcbyberg/notus-nextjs",
    previewUrl: "https://notus-nextjs-delta.vercel.app/landing",
  },
  {
    id: 4,
    title: "Simple Blog Website",
    description:
      "A blog a small business can actually keep up with. No CMS, no monthly fee, no admin panel to log into.",
    features: [
      "Markdown-driven publishing",
      "Fast static page delivery",
      "Structured data for articles",
      "Mobile-first reading layout",
    ],
    image: "/images/projects/3.png",
    tag: ["All", "Web"],
    // Was https://github.com/jcbyberg/nextjs-portfolio — 404 as of 2026-09-01
    // (repo renamed, made private, or deleted). Empty hides the source button,
    // the same way the Bourne To Climb entry does; the live preview below still
    // works. Restore only with a URL that actually resolves.
    gitUrl: "",
    previewUrl: "https://nextjs-portfolio-woad-iota.vercel.app/",
  },
];

const ProjectsSection = () => {
  const [tag, setTag] = useState("All");
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  const handleTagChange = (newTag) => {
    setTag(newTag);
  };

  const filteredProjects = projectsData.filter((project) =>
    project.tag.includes(tag)
  );

  const cardVariants = {
    initial: { y: 50, opacity: 0 },
    animate: { y: 0, opacity: 1 },
  };

  return (
    <section id="projects">
      {/* Answer-first heading + short summary so visitors (and AI engines)
          get the point of the section before the individual cards. */}
      <h2 className="text-center text-4xl font-bold text-white mt-4 mb-4 md:mb-6">
        Websites and apps I&apos;ve built
      </h2>
      {/* The count and the named examples must match projectsData above. This
          read "all six" and named a guitar shop and a Bible study app after
          both were removed on 2026-09-01 for being down — a claim a visitor
          disproves by counting the cards. If you add or remove a project, fix
          this sentence in the same edit, and re-check that every previewUrl
          still returns 200 before leaving "live right now" standing. All four
          were checked on 2026-09-01. */}
      <p className="mx-auto mb-8 md:mb-12 max-w-3xl text-center text-[#ADB7BE]">
        All four of these are live right now, and you can go click around in
        them — a tree service here in Oshawa, a Shopify store you can walk
        through, and two front-end builds you can poke at end to end. Each one
        lists what went into it.
      </p>
      <div className="text-white flex flex-row justify-center items-center gap-2 py-6">
        <ProjectTag
          onClick={handleTagChange}
          name="All"
          isSelected={tag === "All"}
        />
        <ProjectTag
          onClick={handleTagChange}
          name="Web"
          isSelected={tag === "Web"}
        />
        <ProjectTag
          onClick={handleTagChange}
          name="Graphics"
          isSelected={tag === "Graphics"}
        />
      </div>
      <ul ref={ref} className="grid md:grid-cols-3 gap-8 md:gap-12">
        {filteredProjects.map((project, index) => (
          <motion.li
            key={index}
            variants={cardVariants}
            initial="initial"
            animate={isInView ? "animate" : "initial"}
            transition={{ duration: 0.3, delay: index * 0.4 }}
          >
            <ProjectCard
              key={project.id}
              title={project.title}
              description={project.description}
              imgUrl={project.image}
              gitUrl={project.gitUrl}
              previewUrl={project.previewUrl}
              features={project.features}
            />
          </motion.li>
        ))}
      </ul>
    </section>
  );
};

export default ProjectsSection;
