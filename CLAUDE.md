# Project instructions

See [AGENTS.md](AGENTS.md) — it carries the content-authoring rules for this repo
(blog posts, case studies, track guides) and the scripts that enforce them.

Writing or shipping a post: use the `write-blog-post` skill. One command does the
whole job — scaffold, check, build, and confirm the page actually rendered:

```bash
npm run content:post -- <collection> --title "..." --excerpt "..." --tags "..." --body-file draft.md
```

Delegating a post to `agy` or a Sonnet sub-agent: fill in
`.claude/skills/write-blog-post/BRIEF-TEMPLATE.md`, write it to a file, and pass
the file. One dispatch, one post. Verify the markdown file on disk yourself
afterwards — a chat reply saying it passed is not evidence.
