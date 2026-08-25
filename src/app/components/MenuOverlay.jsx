import React from "react";
import Link from "next/link";
import NavLink from "./NavLink";

const MenuOverlay = ({ links }) => {
  return (
    <ul className="flex flex-col py-4 items-center">
      {links.map((link, index) => (
        <li key={index}>
          <NavLink href={link.path} title={link.title} />
        </li>
      ))}
      {/* Prominent CTA, matching the desktop navbar. */}
      <li className="mt-2">
        <Link
          href="/bring-your-idea-to-life"
          className="rounded-full bg-gradient-to-r from-[#FF6A00] via-[#FF9E2C] to-[#FF6A00] px-5 py-2 text-sm font-semibold text-white transition hover:brightness-110"
        >
          Bring Your Idea to Life
        </Link>
      </li>
    </ul>
  );
};

export default MenuOverlay;
