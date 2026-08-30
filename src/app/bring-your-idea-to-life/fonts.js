import { byitlDisplay, byitlBody, byitlMono } from "@/app/fonts";

// The press-sheet type system shared by the two landing pages:
// /bring-your-idea-to-life (Josh Byberg) and /hire-me (Whitespace Design).
//
// These MUST be instantiated exactly once. Declaring them per-page meant two
// modules calling next/font for the same families under the same CSS variable
// names, which failed the production build with "Failed to fetch `DM Mono` from
// Google Fonts". landing.css reads these variable names, so do not rename them.




export const byitlFontVars = `${byitlDisplay.variable} ${byitlBody.variable} ${byitlMono.variable}`;
