import React from "react";
import { CodeBracketIcon, EyeIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

const ProjectCard = ({
  imgUrl,
  title,
  description,
  gitUrl,
  previewUrl,
  problem,
  stack,
  impact,
}) => {
  const gitLink =
    typeof gitUrl === "string" && gitUrl.trim().length > 0 ? gitUrl : null;
  const previewLink =
    typeof previewUrl === "string" && previewUrl.trim().length > 0
      ? previewUrl
      : null;

  // Expanded case-study details. Kept as a plain definition list in the HTML
  // so the text is extractable without any JavaScript.
  const details = [
    { label: "Problem", text: problem },
    { label: "How it was built", text: stack },
    { label: "Impact", text: impact },
  ].filter(({ text }) => typeof text === "string" && text.trim().length > 0);

  return (
    <div>
      <div
        className="h-52 md:h-72 rounded-t-xl relative group bg-[#181818]"
        style={{
          backgroundImage: imgUrl ? `url(${imgUrl})` : undefined,
          backgroundSize: "cover",
        }}
      >
        <div className="overlay items-center justify-center absolute top-0 left-0 w-full h-full bg-[#181818] bg-opacity-0 hidden gap-3 group-hover:flex group-hover:bg-opacity-80 transition-all duration-500 ">
          {/*
            These links contain only an icon, and Heroicons render aria-hidden
            SVGs — without an explicit label a screen reader announces a bare
            "link" and cannot tell source from live site, or say which project.
          */}
          {gitLink ? (
            <Link
              href={gitLink}
              aria-label={`View the source code for ${title}`}
              className="h-14 w-14 border-2 relative rounded-full border-[#ADB7BE] hover:border-white group/link"
            >
              <CodeBracketIcon className="h-10 w-10 text-[#ADB7BE] absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2  cursor-pointer group-hover/link:text-white" />
            </Link>
          ) : null}
          {previewLink ? (
            <Link
              href={previewLink}
              aria-label={`Visit the live ${title} site`}
              className="h-14 w-14 border-2 relative rounded-full border-[#ADB7BE] hover:border-white group/link"
            >
              <EyeIcon className="h-10 w-10 text-[#ADB7BE] absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2  cursor-pointer group-hover/link:text-white" />
            </Link>
          ) : null}
        </div>
      </div>
      <div className="text-white rounded-b-xl mt-3 bg-[#181818] py-6 px-4">
        {/* h3, not h5: the section heading is an h2, so h5 skips two levels
            and breaks screen-reader heading navigation. */}
        <h3 className="text-xl font-semibold mb-2">{title}</h3>
        <p className="text-[#ADB7BE]">{description}</p>
        {details.length > 0 ? (
          <dl className="mt-4 space-y-3 border-t border-[#33353F] pt-4 text-sm">
            {details.map(({ label, text }) => (
              <div key={label}>
                <dt className="font-semibold text-white">{label}</dt>
                <dd className="mt-0.5 leading-relaxed text-[#ADB7BE]">
                  {text}
                </dd>
              </div>
            ))}
          </dl>
        ) : null}
      </div>
    </div>
  );
};

export default ProjectCard;
