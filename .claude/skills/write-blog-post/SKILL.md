---
name: write-blog-post
description: Use when adding, drafting, or editing a blog post, case study, essay, or track guide on whitespacedesign.ca, racedad.ca, or ai.whitespacedesign.ca. Covers where content lives, the frontmatter each brand needs, the scaffold and check scripts, and how to verify a post before it ships.
---

# Writing a post on the Whitespace / Race Dad / AI sites

All three sites are one Next.js repo: `D:\Projects\web-portfolio-nextjs`.
A post is **one markdown file** in `src/content/<collection>/`. Adding the file
is the whole job — routes, index cards, sitemaps and tag pages all derive from
it at build time. Nothing has to be registered anywhere.

## The four collections

| Collection | Directory | Serves at | Shape |
|---|---|---|---|
| `whitespace` | `src/content/whitespace/` | `whitespacedesign.ca/whitespace/<slug>` | design case studies and essays |
| `race-dad` | `src/content/race-dad/` | `racedad.ca/<slug>` | Race Dad posts |
| `ai` | `src/content/ai/` | `ai.whitespacedesign.ca/blog/<slug>` | AI / automation blog |
| `tracks` | `src/content/tracks/` | `racedad.ca/tracks/<slug>` | circuit guides (different shape — no date, no tags) |

Filenames in `whitespace` and `race-dad` carry an ordering prefix (`29-`); the
slug never does. `ai` and `tracks` use no prefix. The scripts handle this.

## The fast path — one command

If you have the body written, this is the whole job:

```bash
cd "D:/Projects/web-portfolio-nextjs"
# draft.md is plain markdown: NO frontmatter, no `# Title` line
npm run content:post -- ai \
  --title "The Title Of The Post" \
  --excerpt "100-250 characters that sell it on the index card and in search." \
  --tags "ai agents, verification" \
  --body-file draft.md
```

It runs all three steps below and then does the one nobody remembers: confirms
the page came out of the build with the title rendered into it. It prints
`DONE` only if every step passed, and exits non-zero naming the failing step
and what to do about it. Add `--no-build` while you are still iterating on the
body, `--force` to overwrite after fixing a draft, `--json` if a script is
driving it.

Use this when delegating. The three-step version below is what it calls, and is
still the right shape when you are writing the body in place over several
passes.

**Dispatching the post to another agent?** `BRIEF-TEMPLATE.md`, next to this
file, is a fill-in brief for `agy` or a Sonnet sub-agent, with the lane table
and the verification rules.

## Do it in three steps

### 1. Scaffold the file

```bash
cd "D:/Projects/web-portfolio-nextjs"
npm run content:new -- ai "The Title Of The Post" \
  --tags "ai agents, verification" \
  --excerpt "One or two sentences that sell the piece on the index card and in search results."
```

It prints the file path, the slug and the live URL. Useful extra flags:

- `--body-file draft.md` (or `--body-file -` for stdin) — use a draft you already
  wrote. A stale frontmatter block and a duplicate `# Title` are stripped for you.
- `--date 2026-08-14` — defaults to today.
- `--image /images/race-dad/<slug>/photo.jpg` — the card/OG image.
- `--client "GP Bikes" --deliverable "Six-page catalogue"` — required for a
  whitespace `--type case-study`. Use `--type essay` for an opinion piece.
- `--author "Josh Byberg"` — set automatically for race-dad.
- `--video https://media.racedad.ca/videos/foo.mp4` — race-dad only.
- `--json` — machine-readable output, for when a script is driving this.

Run `npm run content:new` with no arguments for the usage line, or read the
comment block at the top of `scripts/content/new-post.mjs` for every flag.

### 2. Write the body

Plain markdown, in the file the scaffold created.

- **Start headings at `##`.** The page renders the title as the `<h1>` already.
- **No raw HTML.** The renderer sanitizes it away — your `<div>` silently
  vanishes from the published page. Markdown only.
- **Images are markdown, pointing at a real file under `public/`:**
  `![A rider leaned into turn three](/images/race-dad/<slug>/turn-three.jpg)`.
  Put the files in `public/images/<collection>/<slug>/` first. Always write real
  alt text.
- Keep the excerpt to roughly 100–250 characters — it is the index card and the
  search snippet.
- **race-dad tags:** at least one tag should map to a rebuilt tag hub, or the
  post appears on no tag page. The hubs are in `src/lib/race-dad-tags.js`
  (MiniSBK, MotoMini, Shannonville, Ohvale, FIM, SSRS, Race Report, Minimoto,
  Mechanic, 190cc). The checker warns when none match.

### 3. Check it, then build it

```bash
npm run content:check -- src/content/ai/the-title-of-the-post.md   # just yours
npm run content:check                                              # everything
```

The checker catches what the site fails on quietly: missing frontmatter,
a bad date, an image path that is not on disk, raw HTML, a slug collision that
would break the build, an unfinished `TODO`. **Errors must be zero.** Warnings
are advice — read them and decide.

Then prove the page actually renders:

```bash
npm run build
```

A post is not done because the file exists. It is done when `content:check`
reports zero errors, `npm run build` succeeds, and you have looked at the page
(`npm run dev`, then open the URL the scaffold printed).

### Previewing an `ai` post locally

`npm run dev` then opening the URL **does not work for the `ai` collection**.
`next.config.js` 308-redirects `/blog` and `/blog/*` to `ai.whitespacedesign.ca`
unless the request carries `x-wsai-proxy` — the header the Cloudflare worker sets
when it fetches that section, and load-bearing, since without it the worker would
fetch a redirect back to itself and loop. In dev that means the browser bounces
you to the live site and it looks like your post failed to build.

To see the local page:

```bash
curl -H "x-wsai-proxy: 1" http://localhost:3000/blog/<slug>
```

or put a proxy in front of dev that adds the header. The other three collections
have no such redirect and open normally.

## Things that will bite you

- **A slug collision fails the whole build.** `01-foo.md` and `foo.md` both
  resolve to `foo`. The scaffold refuses to create one; the checker names both
  files if one already exists — including when you check a single file, because
  a collision is a property of the directory, not the file.
- **A slug cannot start with digits and a dash.** The loader reads a leading
  `NN-` as a filename prefix and strips it, so a title like "2099 Goals" would
  serve at `goals`, not `2099-goals`. The scaffold refuses it and asks for an
  explicit `--slug`.
- **An image path that is not in `public/` renders a broken image** — nothing
  errors at build time. The checker is the only thing that catches it.
- **Frontmatter fields outside the known set are ignored** by `src/lib/posts.js`.
  The checker warns rather than letting you believe a field did something.
- **Never hand-write a file into `src/content/` without running the checker.**
  The scaffold exists so the frontmatter is right by construction.

## Where the rules live

`scripts/content/schema.mjs` is the single source of truth for what each
collection requires; both scripts read it. If the site gains a field or a
collection, change it there and both the scaffold and the checker follow.
`src/lib/posts.js` is the runtime loader that actually reads the files.
