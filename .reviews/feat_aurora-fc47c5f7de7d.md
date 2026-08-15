# Review: feat/aurora @ fc47c5f7de7d

Reviewer: qwen — independent cross-family review
Date: 2026-08-14
Scope: Aurora component + wiring (ROUND 2 — verification of the matchMedia fix)

## Verdict
APPROVE

Round-1 LOW #1 (old-Safari MediaQueryList crash) is correctly fixed: subscribe
and unsubscribe fall back as matched pairs, cleanup is still complete, and
modern-browser behaviour is byte-identical. No BLOCKER/HIGH/MEDIUM findings, no
new LOW findings. Nothing MEDIUM-or-higher remains.

## Findings

No BLOCKER findings. No HIGH findings. No MEDIUM findings. No new LOW findings.

The round-2 change under review is exactly one refactor in
`src/app/components/Aurora.jsx:115-130`: the three `MediaQueryList`
subscriptions were moved into `subscribe` / `unsubscribe` helpers that
feature-detect `addEventListener` / `removeEventListener` and fall back to the
deprecated `addListener` / `removeListener` for Safari <= 13. This correctly
addresses round-1 LOW #1.

### Round-1 LOW #1 fix — verification results

1. **Subscribe and unsubscribe use matching APIs — no leak on old Safari.**
   `subscribe` (Aurora.jsx:121-124) keys on `mq.addEventListener`;
   `unsubscribe` (Aurora.jsx:125-128) keys on `mq.removeEventListener`. The
   two members checked differ, but the fallback APIs ship strictly in pairs in
   every shipped engine: EventTarget-based MQLs (Chrome ~78+, Firefox 55+,
   Safari 14+) have both `addEventListener` and `removeEventListener`;
   Safari <= 13 MQLs have neither and instead have both `addListener` and
   `removeListener`. So both helpers always select the same API family on any
   real browser, and the same single `updateTracking` closure reference is
   registered and removed, with no capture flag on either side. Old Safari now
   subscribes via `addListener` and unsubscribes via `removeListener` —
   matched, no listener leak. (A stricter style would key both helpers on the
   same member check, but no shipping browser can split them; not a defect.)
2. **Cleanup is still complete** (Aurora.jsx:134-139): `pointermove` removed
   unconditionally (safe no-op when `tracking` never enabled it),
   `visibilitychange` removed, `queries.forEach(unsubscribe)` removes all
   three matchMedia listeners, and `cancelFrame()` cancels any pending frame.
   All removals use the identical closure references captured at registration.
   Traced line by line; nothing leaked.
3. **No behaviour change on modern browsers.** Where `mq.addEventListener`
   exists the helpers make byte-for-byte the same calls round 1 made
   (`addEventListener("change", updateTracking)` and the matching removal).
   The diff vs round 1 touches only these helper lines plus the explanatory
   comment; `aurora.css`, `page.js`, and the OshawaLanding wiring are
   unchanged.
4. **Round-1 LOW #2 (OshawaLanding indentation) was deliberately not fixed.**
   Confirmed still present on disk; not re-raised, per instructions.

### Carried-over checks (unchanged code, re-confirmed against disk)

- **Cleanup/leaks:** same closure refs in every add/remove pair; `{passive: true}`
  on the pointermove registration does not affect removal (removal matches on
  type/listener/capture only).
- **rAF loop:** convergence is geometric (delta x 0.945/frame); worst case
  |delta| = 0.5 settles below the 0.0005 threshold in ~122 frames (~2 s), then
  `frameId` stays null. Restart paths all traced: pointermove -> `startFrame`
  (guarded by `tracking`, `document.hidden`, `frameId === null`); hidden ->
  visible resumes only while unsettled; tracking toggle re-adds the listener.
  No state exists where pointermove permanently fails to restart the loop, and
  none where it spins forever.
- **Hydration:** render output is a pure function of the `intensity` prop; all
  `window`/`document`/`matchMedia` access is inside `useEffect`. No
  server/client mismatch possible.
- **Stacking/hit-testing:** `.aurora` is `position: fixed; z-index: 0;
  pointer-events: none` (inherited by the whole subtree); content lives in a
  `relative z-[1]` context on both pages. Aurora cannot cover content or
  intercept clicks. Navbar remains viewport-anchored and above the effect.
- **mix-blend-mode: screen:** blending is confined to the `.aurora` stacking
  context; sibling page content composites normally above it.
- **Performance:** only `transform` animates; per-frame `setProperty` touches
  style only inside the 6-element aurora subtree; blobs/layers are promoted
  (`will-change: transform`, translate3d, `filter`, blend-mode), so the
  expensive `blur()` rasters once per blob and per-frame motion is
  compositor-only. No per-frame layout or paint.
- **prefers-reduced-motion:** JS — `tracking` never becomes true, so no
  pointermove listener and no rAF; live OS toggles are handled by the change
  listeners, which also cancel and reset. CSS — `animation: none` and
  `transform: none` under the media query. Result is a fully static gradient.
- **Wiring regressions:** none. Homepage wrapper duplicates `main`'s flex
  classes; /oshawa loses only the intended decorative hero gradient; the
  noscript fallback block survives inside the wrapper. Build confirms both
  routes remain static (see gates below).

## Checks performed

**Read:**
- The round-2 diff at the provided scratchpad path
  (`.../scratchpad/aurora2.diff`) and the on-disk copies of
  `src/app/components/Aurora.jsx`, `src/app/components/aurora.css`,
  `src/app/page.js`, `src/app/oshawa/OshawaLanding.jsx`. Disk matches the
  diff's post-state; `git status` + `git diff --cached --stat` confirm the
  staged set is exactly these four code files plus two `.reviews/` docs — no
  other code changed between rounds.
- The round-1 review (`.reviews/feat_aurora-7fa83e2c35f8.md`) to anchor what
  LOW #1 and LOW #2 were.
- Re-grepped `src/app/**/error.{js,jsx}` — still no error boundary, which is
  what made the round-1 old-Safari crash a blank-page failure and makes the
  fix load-bearing.

**Ran (actual output):**
- `npm run lint` → exit 0, `✔ No ESLint warnings or errors`.
- `npm run build` → exit 0, "Compiled successfully", "Generating static pages
  (8/8)". `/` 15.8 kB (137 kB First Load JS) **○ Static**; `/oshawa` 5.5 kB
  (126 kB First Load JS) **○ Static**; shared First Load JS 78.5 kB.
  Pre-existing warnings only: outdated caniuse-lite and five Tailwind
  palette-rename warnings (present before this diff, unrelated).

**Not verified (stated explicitly):**
- No runtime browser testing. Old-Safari behaviour of the fallback is from
  MDN/compat knowledge of the MediaQueryList API surface (`addListener` /
  `removeListener` being the original pair, `addEventListener` arriving with
  EventTarget inheritance), not from running such a browser.
- rAF/stacking/blend conclusions are from code and CSS painting-order
  analysis, not DevTools observation; compositor promotion is inferred from
  `will-change`/transform/filter/blend rules, not confirmed with a Layers
  panel.
- Visual appearance on either page was not evaluated — correctness review
  only, not art direction.
