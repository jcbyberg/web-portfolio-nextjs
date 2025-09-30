import React from "react";
import Link from "next/link";
import Image from "next/image";

const Footer = () => {
  return (
    <footer className="footer border z-10 border-t-[#33353F] border-l-transparent border-r-transparent text-white">
      <div className="container p-12 flex justify-between">
        <Link href="/" className="flex items-center">
          <Image
            src="/images/logo.png"
            alt="JB Creative logo"
            width={240}
            height={96}
            className="h-15 w-auto filter brightness-0 invert"
            priority
          />
        </Link>
        <p className="text-slate-600">All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;

