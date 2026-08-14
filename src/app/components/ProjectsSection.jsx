"use client";
import React, { useState, useRef } from "react";
import ProjectCard from "./ProjectCard";
import ProjectTag from "./ProjectTag";
import { motion, useInView } from "framer-motion";

const projectsData = [
  {
    id: 0,
    title: "Bourne To Climb",
    description:
      "Website for an Oshawa tree service. Mobile-first one-page build with service details and a direct contact path.",
    image: "/images/projects/bourne-to-climb.jpg",
    tag: ["All", "Web"],
    gitUrl: "",
    previewUrl: "https://bournetoclimb.ca/",
  },
  {
    id: 1,
    title: "Guitar Vault",
    description:
      "Next.js storefront for electric and acoustic guitars, parts, and accessories, with search, sorting, and a product catalogue built from a detail scraper.",
    image: "/images/projects/guitar-vault.jpg",
    tag: ["All", "Web"],
    gitUrl: "https://github.com/jcbyberg/aliexpress-store",
    previewUrl: "https://guitars.joshbyberg.com/",
  },
  {
    id: 2,
    title: "Shopify Demo Store",
    description: "Use Password: 1234",
    image: "/images/projects/1.jpg",
    tag: ["All", "Web"],
    gitUrl: "https://github.com/jcbyberg/notus-nextjs",
    previewUrl: "https://lorem-soap.myshopify.com/",
  },
  {
    id: 3,
    title: "Customized Portfolio Template",
    description: "A rebranded Notus NextJS template, tailored for my personal portfolio.",
    image: "/images/projects/2.jpg",
    tag: ["All", "Web"],
    gitUrl: "https://github.com/jcbyberg/notus-nextjs",
    previewUrl: "https://notus-nextjs-delta.vercel.app/landing",
  },
  {
    id: 4,
    title: "Simple Blog Website",
    description: "Customized blog for small businesses using Next.js and Markdown.",
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
      <h2 className="text-center text-4xl font-bold text-white mt-4 mb-8 md:mb-12">
        My Projects
      </h2>
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
            />
          </motion.li>
        ))}
      </ul>
    </section>
  );
};

export default ProjectsSection;
