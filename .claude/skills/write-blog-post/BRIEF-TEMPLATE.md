# Brief template — dispatching a blog post to agy or a Sonnet sub-agent

Copy this, fill the `<>` slots, write it to a file, and pass it to the agent.
Do not paraphrase it into a chat prompt — a written brief is what keeps a weak
lane on task, and the file survives when the chat reply comes back as ".".

Two things this template is built around:

- **One dispatch, one post.** Never ask an agent for two posts, or for a post
  plus an unrelated edit. `agy` in particular loses the second half of a
  multi-part brief and still exits 0.
- **The file is the deliverable.** The agent's chat reply is optional and often
  empty. Verify `src/content/<collection>/<slug>.md` on disk yourself before
  believing any report.

---

## The brief

```
You are writing one blog post for a Next.js site. This is your only task —
do not touch any other file, do not start a second post, and stop when the
one post is verified.

REPO
  D:\Projects\web-portfolio-nextjs
  Work from that directory. Do not create a new project.

WHAT TO WRITE
  Collection: <ai | whitespace | race-dad | tracks>
  Title:      <The Title Of The Post>
  Angle:      <one or two sentences on the argument the post makes>
  Audience:   <who is reading it and what they should do differently after>
  Length:     <900-1400 words is normal for this site>
  Must cover:
    - <point one>
    - <point two>
    - <point three>
  Must NOT: invent statistics, client names, prices, or case study results.
            If you need a number you do not have, leave the sentence out.

HOUSE STYLE
  - Start headings at `##`. The page renders the title as the h1 already.
  - No raw HTML. The renderer strips it and your markup vanishes silently.
  - No emoji, no "In today's fast-paced world", no bulleted list where a
    sentence works.
  - Plain markdown links only. Internal links are site-absolute:
    [text](/blog/<other-slug>).
  - Images must already exist under public/. If you have no image, use none.

HOW TO SHIP IT — one command, run once.

  cd "D:/Projects/web-portfolio-nextjs"
  # First write the body (markdown, NO frontmatter, no `# Title` line) to
  # draft.md, then run the ONE line below that matches your collection. They
  # are not interchangeable — a form from the wrong row will fail the checker.

  # ai, or race-dad:
  npm run content:post -- ai \
    --title "<The Title Of The Post>" \
    --excerpt "<100-250 characters that sell it on the index card>" \
    --tags "<tag one, tag two, tag three>" \
    --body-file draft.md

  # whitespace case study — --client and --deliverable are REQUIRED:
  npm run content:post -- whitespace \
    --title "<The Title>" \
    --excerpt "<100-250 characters>" \
    --tags "<tag one, tag two>" \
    --client "<Client Name>" \
    --deliverable "<What was delivered>" \
    --body-file draft.md

  # whitespace essay — no client, but the type must be said explicitly:
  npm run content:post -- whitespace --type essay \
    --title "<The Title>" \
    --excerpt "<100-250 characters>" \
    --tags "<tag one, tag two>" \
    --body-file draft.md

  # tracks — a different shape: --location and --summary INSTEAD of
  # --excerpt and --tags, and no date:
  npm run content:post -- tracks \
    --title "<Circuit Name>" \
    --location "<Town, Province>" \
    --summary "<One sentence on what the circuit is>" \
    --body-file draft.md

  That one command scaffolds the file with correct frontmatter, runs the
  content checker, builds the site, and confirms the page rendered. It prints
  DONE only if all four passed. Do not run the steps separately.

IF IT FAILS
  The command prints which step failed and what to do. Fix that, then run the
  same command again with --force added (the file already exists). Do not
  hand-edit files under src/content/ to get around a checker error — the
  checker is right and the site fails quietly on what it catches.

WHEN YOU ARE DONE
  Report exactly these four lines and nothing else:
    file:  <path the command printed>
    url:   <url the command printed>
    check: <errors and warnings count>
    build: <DONE or the failing step>
```

---

## Picking the lane

| Post | Send it to | Why |
|---|---|---|
| Body already drafted, just needs shipping | `agy` | Mechanical: one command, one file. |
| Short post from a tight outline | `agy` | Fully specified, no judgement needed. |
| Post that has to argue something, or match the voice of an existing post | Claude Sonnet sub-agent | Needs taste and cross-reading of other posts. |
| Post that contradicts or supersedes an existing post | Do it in the main session | The call about what to publish is not delegable. |

`agy` dispatch, from the repo:

```sh
agy -p "$(cat brief.md)" --dangerously-skip-permissions < /dev/null
```

## Before you call it done

Cross-family review still applies — the agent that wrote the post does not get
to approve it. Read the file yourself, and check the four things a checker
cannot:

1. It says something. A post that restates the title for 1,000 words passes
   every gate in this repo.
2. It does not contradict an existing post. `ls src/content/<collection>/` and
   look for overlap before publishing, not after.
3. Every claim about a project is true. Invented numbers are the failure mode
   of every model here.
4. The page actually looks right: `npm run dev`, open the URL.
