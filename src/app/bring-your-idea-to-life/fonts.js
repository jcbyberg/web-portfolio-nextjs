import { Schibsted_Grotesk, Literata, DM_Mono } from "next/font/google";

// The press-sheet type system shared by the two landing pages:
// /bring-your-idea-to-life (Josh Byberg) and /hire-me (White Space Designs).
//
// These MUST be instantiated exactly once. Declaring them per-page meant two
// modules calling next/font for the same families under the same CSS variable
// names, which failed the production build with "Failed to fetch `DM Mono` from
// Google Fonts". landing.css reads these variable names, so do not rename them.

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

export const byitlFontVars = `${schibstedGrotesk.variable} ${literata.variable} ${dmMono.variable}`;
