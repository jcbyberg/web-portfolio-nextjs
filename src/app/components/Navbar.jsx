"use client";
import Link from "next/link";
import React, { useState } from "react";
import NavLink from "./NavLink";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/solid";
import MenuOverlay from "./MenuOverlay";
import Image from "next/image";

const navLinks = [
  {
    title: "About",
    path: "#about",
  },
  {
    title: "Projects",
    path: "#projects",
  },
  {
    title: "FAQ",
    path: "#faq",
  },
  {
    title: "Contact",
    path: "#contact",
  },
  // Absolute paths, unlike the in-page hashes above: these leave the home
  // page for other top-level sections, and must still work when the navbar
  // is rendered on a route other than "/".
  {
    title: "Oshawa Offer",
    path: "/oshawa",
  },
  {
    title: "Design",
    path: "/whitespace",
  },
  {
    title: "Racing",
    path: "/race-dad",
  },
  {
    title: "Blog",
    path: "/blog",
  },
];

const Navbar = () => {
  const [navbarOpen, setNavbarOpen] = useState(false);

  return (
    <nav className="fixed mx-auto border border-[#33353F] top-0 left-0 right-0 z-10 bg-[#121212] bg-opacity-80
    ">
      <div className="flex container lg:py-2 flex-wrap items-center justify-between mx-auto px-2 py-1">
        <Link href="/" className="flex items-center">
          <Image
            src="/images/logo.png"
            alt="JB Creative logo"
            width={240}
            height={96}
            className="h-16 w-auto filter brightness-0 invert"
            priority
          />
        </Link>
        <div className="mobile-menu block md:hidden">
          {!navbarOpen ? (
            <button
              onClick={() => setNavbarOpen(true)}
              className="flex items-center px-3 py-2 border rounded border-slate-200 text-slate-200 hover:text-white hover:border-white"
            >
              <Bars3Icon className="h-5 w-5" />
            </button>
          ) : (
            <button
              onClick={() => setNavbarOpen(false)}
              className="flex items-center px-3 py-2 border rounded border-slate-200 text-slate-200 hover:text-white hover:border-white"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          )}
        </div>
        <div className="menu hidden md:flex md:w-auto md:items-center md:gap-4" id="navbar">
          <ul className="flex p-4 md:p-0 md:flex-row md:space-x-8 mt-0">
            {navLinks.map((link, index) => (
              <li key={index}>
                <NavLink href={link.path} title={link.title} />
              </li>
            ))}
          </ul>
          {/*
            Prominent CTA, separate from the plain NavLink list above: this is
            the single conversion target every blog section funnels into, so
            it needs to stand out rather than blend into "About / Projects /
            FAQ / Contact".
          */}
          <Link
            href="/bring-your-idea-to-life"
            className="rounded-full bg-gradient-to-r from-[#FF6A00] via-[#FF9E2C] to-[#FF6A00] px-5 py-2 text-sm font-semibold text-white transition hover:brightness-110"
          >
            Bring Your Idea to Life
          </Link>
        </div>
      </div>
      {navbarOpen ? <MenuOverlay links={navLinks} /> : null}
    </nav>
  );
};

export default Navbar;
