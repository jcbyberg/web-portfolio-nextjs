# Agent notes — portfolio repo (whitespacedesign.ca / racedad.ca / ai.whitespacedesign.ca)

Three brands, one Next.js app. Content is markdown under `src/content/`.

## Adding a blog post, case study, essay or track guide

Do not hand-write a file into `src/content/`. Use the scripts:

```bash
npm run content:new -- <whitespace|race-dad|ai|tracks> "The Title" \
  --tags "one, two" --excerpt "One or two sentences for the index card."
# write the body in the file it prints, then:
npm run content:check -- <that file>
npm run build
```

The full guide — every flag, the frontmatter each brand needs, and the traps
(raw HTML is stripped, images must exist under `public/`, a slug collision fails
the build) — is in `.claude/skills/write-blog-post/SKILL.md`. Read it before
writing content.

`scripts/content/schema.mjs` is the single source of truth for the frontmatter
contract; the scaffolder and the checker both read it. `src/lib/posts.js` is the
runtime loader.

## Definition of done for content

Zero errors from `npm run content:check`, a successful `npm run build`, and the
page looked at in a browser (`npm run dev`). Warnings are advice, not blockers.
