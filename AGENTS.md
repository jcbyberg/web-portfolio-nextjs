# Agent notes — portfolio repo (whitespacedesign.ca / racedad.ca / ai.whitespacedesign.ca)

Three brands, one Next.js app. Content is markdown under `src/content/`.

## Adding a blog post, case study, essay or track guide

Do not hand-write a file into `src/content/`. **One command does the whole job:**

```bash
cd "D:/Projects/web-portfolio-nextjs"
# write the body to draft.md first: plain markdown, NO frontmatter, no `# Title` line
npm run content:post -- <whitespace|race-dad|ai|tracks> \
  --title "The Title Of The Post" \
  --excerpt "100-250 characters that sell it on the index card and in search." \
  --tags "one, two" \
  --body-file draft.md
```

It scaffolds the file with correct frontmatter, runs the content checker, builds
the site, and confirms the page actually rendered with the title on it. It
prints `DONE` only if all four passed, and exits non-zero naming the failing
step and what to do about it.

Run it once. Do not split it back into separate scaffold / check / build steps —
that is where delegated work goes missing.

Flags: `--no-build` while iterating, `--force` to overwrite after fixing a
draft, `--json` for machine-readable output, plus `--date`, `--image`, `--slug`,
`--author`, and `--client` / `--deliverable` for a whitespace case study.

Each collection needs different flags, because they are different shapes. The
form above is for `ai` and `race-dad` posts. The other two need more:

```bash
# whitespace case study — --client and --deliverable are REQUIRED
npm run content:post -- whitespace --title "..." --excerpt "..." --tags "..."   --client "GP Bikes" --deliverable "Six-page catalogue" --body-file draft.md

# whitespace essay — no client, but say so explicitly
npm run content:post -- whitespace --type essay --title "..." --excerpt "..."   --tags "..." --body-file draft.md

# track guide — a different shape entirely: --location and --summary
# instead of --excerpt and --tags, and no date
npm run content:post -- tracks --title "..."   --location "Notre-Dame-de-la-Merci, Quebec"   --summary "One sentence on what the circuit is." --body-file draft.md
```

Passing `--excerpt`/`--tags` to `tracks` does nothing, and the required fields
are left as `TODO` for the checker to fail on. `whitespace` defaults to
`--type case-study`, so omitting `--client`/`--deliverable` fails the check.

The older two-step path still works and is what `content:post` calls:

```bash
npm run content:new -- <collection> "The Title" --tags "..." --excerpt "..."
npm run content:check -- <the file it printed>
```

## House style, in short

- Start headings at `##` — the page renders the title as the `<h1>` already.
- **No raw HTML.** The renderer strips it and your markup vanishes from the
  published page with no error. The checker catches this as an error.
- Images must already exist under `public/images/<collection>/<slug>/`, written
  as markdown with real alt text. A path not on disk renders broken and nothing
  errors at build time.
- Internal links are site-absolute: `[text](/blog/<other-slug>)`.
- No emoji, no "In today's fast-paced world".
- **Never invent statistics, client names, prices or case-study results.** If
  you do not have the number, leave the sentence out. These posts are the sales
  pitch for the business.

The full guide — every flag, the frontmatter each brand needs, and the traps
(slug collisions fail the whole build, a leading `NN-` is stripped from a slug,
unknown frontmatter fields are silently ignored) — is in
`.claude/skills/write-blog-post/SKILL.md`. Read it before writing content.

## Delegating a post to another agent

`.claude/skills/write-blog-post/BRIEF-TEMPLATE.md` is a fill-in brief. Write the
filled version to a file and pass the file — do not paraphrase it into a chat
prompt.

- **One dispatch, one post.** Never brief two posts, or a post plus an unrelated
  edit. Weak lanes drop the second half and still exit 0.
- **`agy`** takes a drafted body or a tight outline. **A Sonnet sub-agent** takes
  anything that has to argue a position or match an existing post's voice.
- **A post that contradicts or supersedes an existing one is not delegable** —
  decide that yourself.
- **The file is the deliverable, the chat reply is optional.** Verify
  `src/content/<collection>/<slug>.md` on disk and re-run the checker yourself.
  A report claiming it passed is not evidence.

## Definition of done for content

`npm run content:post` printing `DONE`, and the page looked at in a browser
(`npm run dev`). Warnings are advice; errors must be zero.

**An `ai` post will not open in dev by URL.** `/blog` and `/blog/*` 308-redirect to
production unless the request carries `x-wsai-proxy`, the header the Cloudflare
worker sets. Preview it with `curl -H "x-wsai-proxy: 1" http://localhost:3000/blog/<slug>`
or through a proxy that adds that header. The command prints this reminder too.

That means it builds and renders — not that it is any good. The agent that wrote
a post does not approve it. Before shipping, check the things no script can:
it says something; it does not duplicate or contradict an existing post
(`ls src/content/<collection>/` first); every factual claim is true.

## Where the rules live

`scripts/content/schema.mjs` is the single source of truth for the frontmatter
contract; the scaffolder and the checker both read it.
`scripts/content/publish-post.mjs` is the one-shot wrapper.
`src/lib/posts.js` is the runtime loader.
