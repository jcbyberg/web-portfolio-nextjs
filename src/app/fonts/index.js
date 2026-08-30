import localFont from 'next/font/local'

// Self-hosted fonts.
//
// These were previously loaded with next/font/google, which downloads each
// family from fonts.gstatic.com AT BUILD TIME. Eight families across five
// layouts meant eight network fetches per build with no retry on this version
// of Next, so one socket failure on the build host failed the whole deploy.
// That happened at least twice — see the note that used to live in
// bring-your-idea-to-life/fonts.js, and the 2026-08-29 failure on DM Mono.
// Serving the files from the repo removes the network from the build entirely.
//
// SEVEN OF THE EIGHT ARE VARIABLE FONTS: one file covers a whole weight range,
// so each is declared with a range ('400 700') rather than as separate static
// weights. Declaring a variable file at a single fixed weight renders every
// weight at the default instance and silently flattens the type. Only DM Mono
// is a genuine static family, so it keeps its two files.
//
// EVERY OPTION OBJECT BELOW MUST STAY A LITERAL. next/font is an SWC
// compile-time transform, not a normal function call: object shorthand, spread,
// and shared config consts all fail the build with "Unexpected key". That is
// why the repetition here is deliberate and must not be refactored away.
//
// To update a face: download the latin woff2 from Google Fonts into ./files and
// keep the range in sync with the weights the CSS actually uses.

// --- Inter: the site-wide default (src/app/layout.js) -----------------------
export const inter = localFont({
  src: './files/inter-var.woff2',
  weight: '100 900',
  display: 'swap',
  fallback: ['system-ui', 'Segoe UI', 'Helvetica Neue', 'Arial', 'sans-serif'],
})

// --- The press-sheet trio ---------------------------------------------------
// Shared by /whitespace and the two landing pages under different CSS variable
// names. Same files, separate instances; with no network involved, declaring
// them twice costs nothing at build time.
export const wsDisplay = localFont({
  src: './files/schibsted-grotesk-var.woff2',
  weight: '400 700',
  variable: '--ws-font-display',
  display: 'swap',
  fallback: ['Helvetica Neue', 'Arial', 'sans-serif'],
})
export const wsBody = localFont({
  src: './files/literata-var.woff2',
  weight: '400 600',
  variable: '--ws-font-body',
  display: 'swap',
  fallback: ['Georgia', 'Times New Roman', 'serif'],
})
export const wsMono = localFont({
  src: [
    { path: './files/dm-mono-400.woff2', weight: '400', style: 'normal' },
    { path: './files/dm-mono-500.woff2', weight: '500', style: 'normal' },
  ],
  variable: '--ws-font-mono',
  display: 'swap',
  fallback: ['ui-monospace', 'SFMono-Regular', 'Consolas', 'monospace'],
})

export const byitlDisplay = localFont({
  src: './files/schibsted-grotesk-var.woff2',
  weight: '400 700',
  variable: '--byitl-font-display',
  display: 'swap',
  fallback: ['Helvetica Neue', 'Arial', 'sans-serif'],
})
export const byitlBody = localFont({
  src: './files/literata-var.woff2',
  weight: '400 600',
  variable: '--byitl-font-body',
  display: 'swap',
  fallback: ['Georgia', 'Times New Roman', 'serif'],
})
export const byitlMono = localFont({
  src: [
    { path: './files/dm-mono-400.woff2', weight: '400', style: 'normal' },
    { path: './files/dm-mono-500.woff2', weight: '500', style: 'normal' },
  ],
  variable: '--byitl-font-mono',
  display: 'swap',
  fallback: ['ui-monospace', 'SFMono-Regular', 'Consolas', 'monospace'],
})

// --- Race Dad (src/app/race-dad/layout.js) ---------------------------------
export const rdDisplay = localFont({
  src: './files/big-shoulders-display-var.woff2',
  weight: '700 800',
  variable: '--font-rd-display',
  display: 'swap',
  // Mirrors --display in race-dad.css:18. Keep the two in step.
  fallback: ['Arial Narrow', 'sans-serif'],
})
export const rdBody = localFont({
  src: './files/archivo-var.woff2',
  weight: '400 700',
  variable: '--font-rd-body',
  display: 'swap',
  fallback: ['Helvetica Neue', 'Arial', 'sans-serif'],
})
export const rdMono = localFont({
  src: './files/martian-mono-var.woff2',
  weight: '400 500',
  variable: '--font-rd-mono',
  display: 'swap',
  // Mirrors --mono in race-dad.css:20 (no SFMono-Regular there).
  fallback: ['ui-monospace', 'Consolas', 'monospace'],
})

// --- AI blog (src/app/blog/layout.js) --------------------------------------
export const aiMono = localFont({
  src: './files/jetbrains-mono-var.woff2',
  weight: '400 700',
  variable: '--ai-font-mono',
  display: 'swap',
  fallback: ['ui-monospace', 'SFMono-Regular', 'Consolas', 'monospace'],
})

// --- Whitespace AI (src/app/ai/layout.js) -----------------------------------
// The AI arm inverts the press-sheet identity: emitted light on black instead
// of ink on stock. It keeps Schibsted Grotesk for display, so the two brands
// share a voice, and swaps the serif body for JetBrains Mono — the same file
// the AI blog uses, under its own variable name so the two sections can never
// reach into each other's scope. No new font files, so the build stays
// network-free.
export const wsaiDisplay = localFont({
  src: './files/schibsted-grotesk-var.woff2',
  weight: '400 700',
  variable: '--wsai-font-display',
  display: 'swap',
  fallback: ['Helvetica Neue', 'Arial', 'sans-serif'],
})
export const wsaiMono = localFont({
  src: './files/jetbrains-mono-var.woff2',
  weight: '400 700',
  variable: '--wsai-font-mono',
  display: 'swap',
  fallback: ['ui-monospace', 'SFMono-Regular', 'Consolas', 'monospace'],
})
