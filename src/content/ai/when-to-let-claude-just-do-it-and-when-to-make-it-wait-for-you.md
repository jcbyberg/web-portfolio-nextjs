---
title: "When to Let Claude Just Do It (and When to Make It Wait for You)"
date: "2026-09-13"
type: "post"
excerpt: "A per-task test for autonomy: weigh the cost of a wrong output reaching someone outside your business against how easily you'd catch it, and know the gate can tighten again."
tags:
  - "Claude"
  - "automation"
  - "workflow"
  - "business ops"
image: "/images/ai/when-to-let-claude-just-do-it-and-when-to-make-it-wait-for-you.jpg"
---

![A railway semaphore signal held horizontal at stop, with a "Passengers must not cross the line" warning sign mounted below it.](/images/ai/when-to-let-claude-just-do-it-and-when-to-make-it-wait-for-you.jpg)

Once a Claude workflow is actually working — the task is picked well, the context is [set up once instead of re-explained every time](/blog/give-claude-the-context-once-building-a-reusable-project-for-a-repeat-task), the first several runs came out usable — there's a decision waiting that has nothing to do with whether the tool works. Does the output go straight out the door, or land in a queue for a person to look at first?

It's tempting to treat that as one setting you flip per task: this one runs unattended, that one always needs a human. A better way to think about it isn't "how much do I trust this workflow" but "what happens if this specific output is wrong, and how would I find out." Those two questions don't move together. A very reliable workflow can still need an approval gate, because the one time it's wrong is expensive. A shakier one can be fine running loose, because a bad output there just sits somewhere quiet until someone notices.

## Why this is worth deciding deliberately

Across the AI tooling industry right now, the general direction is away from tools that only answer when asked, toward tools that carry out a sequence of steps on their own and surface the result for review rather than requiring a person to drive every click. That's a real shift, and a useful one — but it means the approval question stops being optional. When a system can act rather than just answer, "who checks this before it lands, and when" becomes part of designing the workflow, not an afterthought you skip because the tool seems to be working fine.

This post isn't about where that trend goes next. It's about a way to make the approval-gate call for your own workflows, task by task, instead of inheriting whatever default the tool ships with.

## The actual question: cost times catchability

Run each task through two questions.

First: what does it cost if a wrong output reaches someone outside your business — a client, a vendor, a regulator? Not "is it embarrassing," but what actually happens next. Does someone have to issue a correction? Does a number get repeated somewhere you can't pull back? Does it commit you to something you now have to honor or walk back?

Second: if it's wrong, how would you find out, and how fast? Some errors are self-announcing — a client replies confused, a number obviously doesn't add up. Others are silent. Nobody flags a slightly-off internal summary because nobody outside the team reads it closely, and a client won't do your proofreading for you — they'll just form an impression and move on, and you'll never hear about it.

Put those together and the rule is simple: high external cost plus low odds of catching it after the fact means the approval gate stays. Low cost plus an error that would surface on its own, or just doesn't matter much sitting uncorrected for a day, means it's fine to let the workflow run and check in on a schedule instead of every output. Notice what's absent from that rule: how long the workflow has run, how much you like the tool, how technically impressive the setup is. None of that changes what a wrong output actually does. Only the two questions above do.

## What this looks like on real tasks

A workflow drafting an internal summary of a meeting — read only by your own team, acted on informally rather than filed or forwarded outward — is a reasonable candidate to run unattended. If a detail is slightly wrong, someone who was in the room will likely notice within the week, and the cost in the meantime is close to nothing.

A workflow drafting a reply that goes to a client, or that includes a price, or that commits to a date or deliverable, should not run unattended, whatever its track record. Not because the tool is untrustworthy in general, but because both questions are working against you at once. A wrong price doesn't get quietly corrected — either someone notices and you look sloppy, or nobody notices and you've over- or undercharged and only find out later. A date you didn't mean to commit to is now a commitment. Those outputs belong in a draft for a human to read first, permanently — not a stage you graduate out of, but a property of the task itself.

Most workflows sit somewhere between those two poles, which is exactly why the two-question test matters more than a gut feeling about the tool. A workflow that triages inquiries and drafts a suggested reply for staff to send — rather than sending it directly — sits closer to the safe end, because a person is still in the path before anything reaches the outside world. A workflow that auto-sends that same reply does not, because the same content just crossed from draft to final with no one reading it. The task didn't change; the point where a person looks at it did, and that's the whole distance between the two.

## The same task can move in either direction

It's easy to assume this decision only loosens over time. The normal path is that a workflow starts under a tight gate — every output read before it goes anywhere — because you don't yet know its error rate. After a month of runs, once you've actually seen enough outputs to know how often and how it gets things wrong, it's reasonable to loosen that to a spot-check: read one in five, say, rather than every single one. That loosening should be earned by evidence you looked at, not by the fact that nothing has gone wrong yet — "nothing has gone wrong that I know of" is a much weaker claim than "I checked, and it's reliable."

The path people skip is the reverse one, and it matters just as much: a workflow that earned its way to spot-checks, or to running unattended, should get pulled back to full approval the moment it produces a bad output nobody caught before it did damage. That isn't a failure of the workflow — it's the system treating a real miss as new information instead of a fluke to shrug off. The mistake is looking at a strong track record and treating it as permanent clearance, so that when the one bad run happens, there's no gate left to catch it. Tighten back up immediately, stay tight until you understand what specifically went wrong, and only loosen again once you've closed that gap — not on a timer, and not on the general sense that the tool has usually been fine.

## The setup still matters — this is the next decision, not a replacement for it

None of this replaces the work in the [companion posts](/blog/automating-your-workflows-with-claude-where-to-start) — picking the right task, giving Claude the context once, building a reference set that actually reflects what "done" looks like. A badly set up workflow produces bad output regardless of how tight or loose the gate is; the gate doesn't fix a task that was never scoped well.

What the approval question adds is the layer on top of a workflow that already works: given that it runs reliably, who looks at the output, and when. Answer that per task, based on what a wrong output would actually cost and how you'd find out it happened — and revisit the answer every time a run surprises you, in either direction. It isn't about how much you trust Claude in general. It's about what this specific wrong answer would do if nobody caught it.
