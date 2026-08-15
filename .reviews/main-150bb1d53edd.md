# Review: main-150bb1d53edd
Reviewer: codex Gemini 3.1 Pro (Low)
Date: 2026-08-15
Verdict: REQUEST CHANGES

## Summary
The UI correctly replaces the three prose fields (`problem`, `stack`, `impact`) with a structured `features` list, and all dead props were cleaned up cleanly. The `OshawaLanding` data and `EmailSection` semantic heading fixes are solid. However, the copy introduced for the Bourne To Climb project violates the repository's strict SEO-outcome rules.

## Findings
- **BLOCKER** - `src/app/components/ProjectsSection.jsx:154`: The bullet `"Set up to build your SEO and improve your local search visibility"` violates the rule in `src/app/oshawa/offer-config.js` and `oshawa-outreach.md §11` against ranking or SEO-outcome language. "Improve your local search visibility" is an outcome claim (and a causation claim) rather than a description of a deliverable. Despite the author's inline comment attempting to justify it as a "forward-looking capability", it still violates the "Describe deliverables only" requirement.
  - **Fix**: Rephrase to describe the deliverable only, e.g., `"Set up with optimized page titles, descriptions, and local schema data"`.

## Verification performed
- `npm run build`: Exited with code 0. No build errors.
- Checked `src/app/oshawa/offer-config.js` for the rules on SEO-outcome language.
- Checked `src/app/components/ProjectCard.jsx` and `ProjectsSection.jsx` to ensure `problem`, `stack`, and `impact` were completely removed and `features` was properly implemented.
- `git grep ProjectCard`: Confirmed `ProjectCard` is only used in `ProjectsSection.jsx` and all prop usages match the new signature.
- Reviewed `src/app/components/EmailSection.jsx` and `Navbar.jsx` to confirm HTML semantics and link structure are valid.
