import { Schibsted_Grotesk, Literata, DM_Mono } from "next/font/google";
import BringYourIdeaToLife from "./BringYourIdeaToLife";

// This page carries the Whitespace Designs press-sheet type system
// (Schibsted Grotesk / Literata / DM Mono) rather than the site's default
// Inter, so it needs its own font instances — scoped with distinct CSS
// variable names so they never collide with the whitespace section's copy.
const schibstedGrotesk = Schibsted_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--byitl-font-display",
  display: "swap",
});

const literata = Literata({
  subsets: ["latin"],
  weight: ["400", "600"],
  variable: "--byitl-font-body",
  display: "swap",
});

const dmMono = DM_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  style: ["normal"],
  variable: "--byitl-font-mono",
  display: "swap",
});

const title = "Bring Your Idea to Life — Web Design, Print & AI Automation";
const description =
  "Web design, print collateral, trade show graphics, social media and AI automation for small businesses, racing programs and organizations across Ontario. One person, start to finish.";

export const metadata = {
  title,
  description,
  alternates: {
    canonical: "/bring-your-idea-to-life",
  },
  openGraph: {
    type: "website",
    url: "https://joshbyberg.com/bring-your-idea-to-life",
    title,
    description,
    locale: "en_CA",
    images: [
      {
        url: "/images/og-image.png",
        width: 1200,
        height: 630,
        alt: "Josh Byberg — Web Developer & Graphic Designer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["/images/og-image.png"],
  },
};

export default function BringYourIdeaToLifePage() {
  return (
    <BringYourIdeaToLife
      fontVars={`${schibstedGrotesk.variable} ${literata.variable} ${dmMono.variable}`}
    />
  );
}
