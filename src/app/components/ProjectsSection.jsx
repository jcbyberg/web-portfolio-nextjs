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
      "Website for an Oshawa tree service. Mobile-first one-page build with service details and a direct contact path.",
    // Outcome wording mirrors the vetted copy on /oshawa: client-reported,
    // explicitly unverified, no causation promised
    // (data/permissions/bourne-to-climb.md).
    problem:
      "An owner-operated Oshawa tree service had no website — customers couldn't find the business online, review its services, or ask for a quote.",
    stack:
      "Next.js, React, and Tailwind CSS in a one-page, mobile-first layout, with semantic structured data so search engines and AI assistants can read the services and the Oshawa service area correctly.",
    impact:
      "A live site at bournetoclimb.ca with clear service details and a direct contact path. Since it launched, the owner reports more work leads than the team can handle. Reported by the owner; not independently verified, and not a result promised to anyone else.",
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
    id: 1,
    title: "Guitar Vault",
    description:
      "Next.js storefront for electric and acoustic guitars, parts, and accessories, with search, sorting, and a product catalogue built from a detail scraper.",
    problem:
      "Prove out a production-grade e-commerce storefront with a large product catalogue — without entering every product by hand.",
    stack:
      "Next.js, React, and Tailwind CSS, plus a custom scraper pipeline that collects and normalizes product details into a searchable, sortable catalogue.",
    impact:
      "A live storefront at guitars.joshbyberg.com where visitors can browse electric and acoustic guitars, parts, and accessories with search and sorting across the full catalogue.",
    image: "/images/projects/guitar-vault.jpg",
    tag: ["All", "Web"],
    gitUrl: "https://github.com/jcbyberg/aliexpress-store",
    previewUrl: "https://guitars.joshbyberg.com/",
  },
  {
    id: 2,
    title: "Shopify Demo Store",
    description:
      "A working Shopify storefront demo. Use Password: 1234 to browse it.",
    problem:
      "Show businesses what a Shopify store looks and feels like in practice, before they commit to a build.",
    stack:
      "Shopify storefront with a customized theme, demo product catalogue, and standard checkout flow.",
    impact:
      "A browsable store anyone can walk through (password 1234), useful for judging structure, layout, and product presentation on Shopify.",
    image: "/images/projects/1.jpg",
    tag: ["All", "Web"],
    gitUrl: "https://github.com/jcbyberg/notus-nextjs",
    previewUrl: "https://lorem-soap.myshopify.com/",
  },
  {
    id: 3,
    title: "Customized Portfolio Template",
    description:
      "A rebranded Notus NextJS template, tailored for my personal portfolio.",
    problem:
      "An open-source template didn't match the branding or content structure the site actually needed.",
    stack:
      "Next.js and Tailwind CSS, reworking the Notus template's components, styling, and pages rather than rebuilding from scratch.",
    impact:
      "A live landing and portfolio demo showing how a stock template can be adapted into a custom, on-brand site.",
    image: "/images/projects/2.jpg",
    tag: ["All", "Web"],
    gitUrl: "https://github.com/jcbyberg/notus-nextjs",
    previewUrl: "https://notus-nextjs-delta.vercel.app/landing",
  },
  {
    id: 4,
    title: "Simple Blog Website",
    description:
      "Customized blog for small businesses using Next.js and Markdown.",
    problem:
      "Small businesses need a blog they can publish to without paying for or maintaining a heavy CMS.",
    stack:
      "Next.js with Markdown-based content and Tailwind CSS — posts are plain files, so publishing needs no admin panel.",
    impact:
      "A lightweight blog template that is cheap to host and simple to update, suitable as a starting point for a small-business content site.",
    image: "/images/projects/3.png",
    tag: ["All", "Web"],
    gitUrl: "https://github.com/jcbyberg/nextjs-portfolio",
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
      <p className="mx-auto mb-8 md:mb-12 max-w-3xl text-center text-[#ADB7BE]">
        Every project below is live and visitable today — from a website for an
        Oshawa tree service serving the Durham Region to a full e-commerce
        storefront. Each entry covers the problem it solved, how it was built,
        and what it does for the people using it.
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
              problem={project.problem}
              stack={project.stack}
              impact={project.impact}
            />
          </motion.li>
        ))}
      </ul>
    </section>
  );
};

export default ProjectsSection;
