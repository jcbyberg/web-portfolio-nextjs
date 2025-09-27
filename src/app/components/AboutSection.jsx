"use client";
import React, { useTransition, useState } from "react";
import Image from "next/image";
import TabButton from "./TabButton";

const TAB_DATA = [
  {
    title: "Dev",
    id: "dev",
    content: (
      <div className="space-y-4 rounded-lg border border-slate-700/50 bg-slate-900/40 p-6">
        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <h3 className="text-xl font-semibold text-white mb-2">Languages & Core Skills</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>Python</li>
              <li>Java</li>
              <li>JavaScript</li>
              <li>HTML & CSS</li>
            </ul>
          </div>
          <div>
            <h3 className="text-xl font-semibold text-white mb-2">Frameworks & Libraries</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>React</li>
              <li>Next.js</li>
            </ul>
          </div>
          <div>
            <h3 className="text-xl font-semibold text-white mb-2">Tools & Collaboration</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>Git (version control, collaboration, branching workflows)</li>
              <li>API integration & automation</li>
            </ul>
          </div>
          <div>
            <h3 className="text-xl font-semibold text-white mb-2">CMS & Platforms</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>WordPress (themes, plugins, customization)</li>
              <li>Magento (storefronts, e-commerce solutions)</li>
              <li>Wix (fast, lightweight websites)</li>
              <li>Shopify (theme and store customization)</li>
            </ul>
          </div>
        </div>
      </div>
    ),
  },
  {
    title: "Graphic Design",
    id: "graphicsDesign",
    content: (
      <div className="space-y-4 rounded-lg border border-slate-700/50 bg-slate-900/40 p-6">
        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <h3 className="text-xl font-semibold text-white mb-2">Brand Identity</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>Logos (new or refreshed)</li>
              <li>Brand guidelines (colors, typography, usage)</li>
              <li>Icon sets</li>
              <li>Social profile branding</li>
            </ul>
          </div>
          <div>
            <h3 className="text-xl font-semibold text-white mb-2">Digital & Web Graphics</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>Website headers and hero images</li>
              <li>Web banners & sliders</li>
              <li>Infographics </li>
              <li>Email marketing graphics</li>
            </ul>
          </div>
          <div>
            <h3 className="text-xl font-semibold text-white mb-2">Marketing & Promotional</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>Posters, flyers, brochures</li>
              <li>Business cards & stationery</li>
              <li>Social media ads & banners</li>
              <li>Event signage and roll-up banners</li>
            </ul>
          </div>
          <div>
            <h3 className="text-xl font-semibold text-white mb-2">Product & Packaging</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>Labels and packaging design</li>
              <li>Product mockups (for online stores)</li>
              <li>Box and bag designs</li>
            </ul>
          </div>
          <div>
            <h3 className="text-xl font-semibold text-white mb-2">Content Creation</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>Custom illustrations</li>
              <li>Social media templates (Instagram, Facebook, LinkedIn)</li>
              <li>Presentation decks (PowerPoint, Keynote)</li>
            </ul>
          </div>
          <div>
            <h3 className="text-xl font-semibold text-white mb-2">Specialized Materials</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>Merchandise design (t-shirts, mugs, stickers)</li>
              <li>Book covers & magazine layouts</li>
              <li>Ads for print or digital campaigns</li>
            </ul>
          </div>
        </div>
      </div>
    ),
  },
  {
    title: "AI, Automation & Consulting",
    id: "ai",
    content: (
      <div className="space-y-4 rounded-lg border border-slate-700/50 bg-slate-900/40 p-6">
        <h3 className="text-xl font-semibold text-white">AI, Automation & Consulting</h3>
        <ul className="list-disc pl-5 space-y-1">
          <li>Workflow automation (custom scripts, integrations, bots)</li>
          <li>AI implementation (content, design, analytics, assistants)</li>
          <li>Technical consulting & strategy (scaling, optimization, workflows)</li>
          <li>Digital transformation guidance for small businesses</li>
        </ul>
      </div>
    ),
  },
];

const AboutSection = () => {
  const [tab, setTab] = useState(TAB_DATA[0].id);
  const [isPending, startTransition] = useTransition();

  const handleTabChange = (id) => {
    startTransition(() => {
      setTab(id);
    });
  };

  const currentTab = TAB_DATA.find((t) => t.id === tab);

  return (
    <section className="text-white" id="about">
      <div className="md:grid md:grid-cols-2 gap-8 items-center py-8 px-4 xl:gap-16 sm:py-16 xl:px-16">
        <div className="flex justify-center md:justify-start">
          <Image
            src="/images/about-image.jpg"
            alt="About section portrait"
            width={500}
            height={500}
            className="w-full h-auto max-w-[500px] rounded-lg object-cover"
            style={{ objectPosition: "center 75%" }}
            priority
          />
        </div>
        <div className="mt-4 md:mt-0 text-left flex flex-col h-full">
          <h2 className="text-4xl font-bold text-white mb-4">About Me</h2>
          <p className="text-base lg:text-lg">
            I'm a full-stack developer and graphic designer who loves building fast, interactive, and responsive experiences. My toolkit spans Java, JavaScript, React, Node.js, Python, HTML/CSS, and Git a strong track record with WordPress, Magento, Next.js, Shopify, and more. I move quickly, learn even faster, and enjoy pairing clean UI with reliable, scalable backends. I'm a collaborative teammate who values clear communication and code quality, and I'm especially excited about automation and AI-using them to streamline workflows, boost performance, and unlock smarter, more delightful products.
          </p>
          <div className="flex flex-row justify-start mt-8 space-x-4">
            <TabButton
              selectTab={() => handleTabChange("dev")}
              active={tab === "dev"}
            >
              Dev
            </TabButton>
            <TabButton
              selectTab={() => handleTabChange("graphicsDesign")}
              active={tab === "graphicsDesign"}
            >
              Graphic Design
            </TabButton>
            <TabButton
              selectTab={() => handleTabChange("ai")}
              active={tab === "ai"}
            >
              AI, Automation & Consulting
            </TabButton>
          </div>
          <div className="mt-8">
            {currentTab?.content}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;


