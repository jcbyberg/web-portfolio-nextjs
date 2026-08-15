import React from "react";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import { FAQ_ITEMS } from "../faq-content";

// Intentionally a server component with native <details>/<summary>: the
// answers stay in the HTML with zero JavaScript, which is what both search
// engines and AI assistants extract from.
const FAQSection = () => {
  return (
    <section id="faq" className="py-8 px-4 sm:py-16 xl:px-16">
      <h2 className="text-center text-4xl font-bold text-white">
        Frequently Asked Questions
      </h2>
      <p className="mx-auto mt-4 max-w-2xl text-center text-[#ADB7BE]">
        Common questions from businesses in Oshawa and the Durham Region about
        how I work and what a project looks like.
      </p>

      <div className="mx-auto mt-10 max-w-3xl space-y-4">
        {FAQ_ITEMS.map(({ question, answer }) => (
          <details
            key={question}
            className="group rounded-xl border border-[#33353F] bg-[#181818] px-6 py-5 open:border-cyan-400/40"
          >
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold text-white [&::-webkit-details-marker]:hidden">
              {question}
              <ChevronDownIcon className="h-5 w-5 shrink-0 text-[#ADB7BE] transition-transform duration-300 group-open:rotate-180" />
            </summary>
            <p className="mt-3 leading-relaxed text-[#ADB7BE]">{answer}</p>
          </details>
        ))}
      </div>
    </section>
  );
};

export default FAQSection;
