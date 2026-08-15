# Review: feat/aurora @ 7fa83e2c35f8

Reviewer: qwen — independent cross-family review
Date: 2026-08-15
Scope: Aurora component + wiring

## Verdict
APPROVE

No BLOCKER, HIGH, or MEDIUM findings. Two LOW items below (one real but
vanishingly rare crash path, one cosmetic). Neither blocks merge.

## Findings

1. **LOW** — `src/app/components/Aurora.jsx:116-118` — `MediaQueryList.addEventListener`
   is not implemented in Safari versions predating its support (roughly Safari ≤ 13,
   2019-era; those need the deprecated `addListener`). On such a browser the effect
   throws a `TypeError` at line 116 before attaching anything else. Because the app
   has **no** `app/error.js` error boundary (checked — none exists), an uncaught
   effect error in React 18 unmounts the whole root: the failure mode is a blank
   page, not merely a dead background.
   *Failure scenario:* a visitor on macOS Catalina / iOS 13 era Safari opens either
   page and sees a blank screen.
   *Why LOW, not higher:* in 2026 that browser population is a rounding error
   (<0.1% share; those OS versions stopped receiving Safari updates years ago), so
   accepting it is defensible. If it is not acceptable, the fix is a five-line
   guard, e.g. `const on = (mql, fn) => mql.addEventListener ? mql.addEventListener("change", fn) : mql.addListener(fn);`
   (and matching `off`) — not a redesign.

2. **LOW (cosmetic)** — `src/app/oshawa/OshawaLanding.jsx:137-471` — the content
   wrapped by the new `<div className="relative z-[1]">` was not re-indented; ~335
   lines sit one indent level shallower than their nesting implies. No behavior
   impact (JSX doesn't care), `npm run lint` passes, and no Prettier check is
   configured. Flagging only so a future reader doesn't mis-nest while editing.

No BLOCKER findings. No HIGH findings. No MEDIUM findings.

### Verified clean — the specific questions asked

- **Cleanup is complete (Aurora.jsx:122-129).** `pointermove` (safe no-op if it was
  never added because `tracking` stayed false), `visibilitychange`, all three
  matchMedia `change` listeners, and the pending frame via `cancelFrame()` are all
  removed with the same closure references that were registered. `removeEventListener`
  matches on type/listener/capture only, so registering with `{passive: true}` does
  not defeat removal. No leak paths found.
- **rAF loop terminates and cannot stick.** Convergence is geometric (delta ×
  0.945/frame), so from the worst-case |delta| = 0.5 the loop self-stops at the
  0.0005 threshold in ~122 frames (~2 s) and never spins indefinitely. Restart
  paths were traced for every stopped state: pointermove → `startFrame` (guarded by
  `tracking`/`document.hidden`/`frameId === null`); hidden→visible →
  `handleVisibilityChange` resumes only if unsettled; tracking flipped back on →
  listener re-added. Race cases check out: a pointermove event already queued when
  tracking flips off still runs but `startFrame` sees `tracking === false` and does
  nothing; float-stall below the threshold is impossible (rounding stalls at
  ~1e-15, five orders of magnitude under the threshold).
- **Hydration is safe.** Render output is a pure function of the `intensity` prop;
  every `window`/`document`/`matchMedia` access is inside `useEffect`, so server
  HTML and first client render are identical.
- **Stacking/hit-testing.** Aurora is `position: fixed; z-index: 0` +
  `pointer-events: none` (inherited by the whole subtree — it's an inherited
  property), content sits in a `relative z-[1]` stacking context, so aurora cannot
  cover content visually or intercept clicks. `main`'s `bg-[#121212]` is an
  in-flow block background and paints *before* z-0 positioned elements in CSS
  painting order, so the effect is visible above it and below content — correct.
  Navbar (`fixed … z-10`) is now inside the `z-[1]` wrapper: its z-10 resolves
  within that context, still above aurora; `layout.js`/`globals.css` put no
  transform/filter on any ancestor, so it remains viewport-anchored and works.
- **`mix-blend-mode: screen` is isolated.** It creates stacking contexts on the
  blobs, but blending is confined to the `.aurora` stacking context (fixed +
  z-index). Sibling page content is composited normally above it, not blended.
- **Performance.** Only `transform` animates (keyframes + custom properties
  consumed by `translate3d`). Per-frame `setProperty` invalidates style only in the
  6-element aurora subtree; blobs/layers are promoted (`will-change: transform`,
  translate3d, filter, blend-mode each promote), so per-frame motion is
  compositor-only and `blur()` rasters once per blob, not per frame. No per-frame
  layout or paint found.
- **`prefers-reduced-motion` genuinely removes motion.** JS side: `tracking` never
  becomes true → no pointermove listener, no rAF (and a live OS toggle is handled
  via the `change` listeners, which also cancel/reset). CSS side:
  `animation: none` + `transform: none` under the media query. Result is a static
  gradient — no drift, no rAF, no pointer tracking.
- **No wiring regressions.** The homepage wrapper duplicates main's flex classes,
  so layout is equivalent; `mt-24`, anchors, Navbar, and Footer are intact. On
  /oshawa only the intended decorative hero gradient was removed; the noscript
  fallback style block and all sections survive inside the wrapper. Build output
  confirms both routes remain fully static (○).

## Checks performed

**Read:**
- The staged diff at the provided scratchpad path, and the on-disk copies of
  `src/app/components/Aurora.jsx`, `src/app/components/aurora.css`,
  `src/app/page.js`, `src/app/oshawa/OshawaLanding.jsx` — disk matches the diff's
  post-state; `git diff --cached --stat` confirms these are exactly the staged
  code changes (plus a staged `.reviews/aurora-build-report.md`, not code).
- Supporting context: `src/app/layout.js`, `src/app/globals.css`,
  `src/app/components/Navbar.jsx`, `src/app/components/MenuOverlay.jsx`,
  `package.json`; grepped `src/` for other `fixed`/`sticky` elements and for an
  `error.{js,jsx}` boundary (none).

**Ran (actual output):**
- `npm run lint` → exit 0, `✔ No ESLint warnings or errors`.
- `npm run build` → exit 0, compiled successfully; `/` (15.8 kB, 137 kB First
  Load JS) and `/oshawa` (5.47 kB, 126 kB First Load JS) both **○ Static**; 8/8
  static pages generated. Pre-existing warnings only: outdated caniuse-lite and
  Tailwind v2/v3 palette-rename warnings (present before this diff, unrelated).

**Not verified (stated explicitly):**
- No runtime browser testing was performed — rAF/stacking/blend conclusions are
  from code and CSS painting-order analysis, not DevTools observation. Compositor
  promotion is inferred from `will-change`/transform/filter/blend rules, not
  confirmed with the Layers panel.
- Old-Safari behavior (finding 1) is from MDN/compat knowledge of
  `MediaQueryList.addEventListener` support, not tested on the browser.
- Visual appearance (does the aurora actually look right on both pages) was not
  evaluated — this review covers correctness, not art direction.
