---
title: "One Workflow, One Job"
date: "2026-09-13"
type: "post"
excerpt: "Why folding a third task into an existing Claude setup makes all of them worse, and the checkable signal that tells you it's time to split it into two."
tags:
  - "Claude"
  - "automation"
  - "workflow"
  - "business ops"
image: "/images/ai/one-workflow-one-job.jpg"
---

![Abstract art of an organic web of fine glowing threads branching separately through deep space, shifting between periwinkle blue and mint green.](/images/ai/one-workflow-one-job.jpg)

Once you have one Claude workflow that actually works — the task was picked well, the [context is set up once instead of re-explained every time](/blog/give-claude-the-context-once-building-a-reusable-project-for-a-repeat-task), you've [worked out how much a human needs to check it](/blog/when-to-let-claude-just-do-it-and-when-to-make-it-wait-for-you) — a second temptation shows up right behind the first one. You already have a saved project that knows your business. Why not point it at the next repeating task too, instead of building another one from scratch?

The setup is right there. It already has your glossary, your tone, your examples of good output. Adding a second job to it feels like reuse, not new work. It rarely stays that way.

## What actually happens when you fold a second task in

A saved Claude project is not a person you're training once and trusting from then on. It's a set of instructions, reference documents and examples that get read fresh, from the top, every time you run it. Everything in there is in scope for every run, whether that run needs it or not.

That's fine when the setup serves one task. The instructions describe one output. The reference documents are the two or three things that task needs. The examples are all examples of the same kind of good result. Nothing in the setup is arguing with anything else in the setup, because there's only one job to argue about.

Add a second, unrelated task, and that stops being true. Say the first job is drafting weekly status updates from meeting notes — three sections, plain language, a fixed glossary of project names. The second job you fold in is triaging support emails into categories. Now the instructions have to say something like "if this is a status update, use the three-section format; if this is a support email, use the category format instead" — which means every run starts by figuring out which set of instructions actually applies to it, rather than just doing the work. The reference documents pile up the same way: the project-name glossary is dead weight on a support-triage run, and the support-category list is dead weight on a status update. Neither run needs to see the other task's materials, but both runs get them anyway, because the setup can't tell in advance which parts will matter.

The examples are where it gets actively harmful rather than just wasteful. An example of a good status update ("write it as flowing paragraphs, keep it warm") and an example of a good triage response ("write it as a single category label, nothing else") are not just different — they're instructions that contradict each other if the model can't tell which one it's supposed to be matching right now. You end up with output that hedges: a status update with a stray category tag in it, or a triage response that's grown an unnecessary paragraph of prose, because the setup is quietly serving two masters and neither one wins cleanly.

None of this shows up as an error. Nothing crashes. What you get instead is output that's a little worse than it used to be — the tone slightly off, a field missing, a format half-followed — and because it's still fluent and still roughly plausible, it's easy to blame on "the model having a bad day" rather than on the setup now doing two unrelated jobs at once.

## The signal that tells you you've crossed the line

You don't need to guess at this. There's a specific, checkable signal, and it's worth watching for on purpose rather than noticing it by accident six weeks in.

If you find yourself starting a run by first telling the setup which task this is — "this one's a support email, not a status update" — before you paste in the actual input, you've crossed it. That sentence is you doing, by hand, every single time, the exact thing a reusable setup exists to make unnecessary: front-loading context so you don't have to re-explain it per run. The moment the "context" is "which mode to be in," the setup has stopped saving you the thing it was built to save you.

A second version of the same signal: the instructions have grown past what you could skim in under a minute. One task's instructions, written honestly, stay short — what the output looks like, what to flag rather than guess at, what "done" means. Two unrelated tasks' instructions, stitched together with conditionals, get long fast, and length here isn't neutral. An instruction set nobody can hold in their head is one nobody actually maintains — you stop noticing when a line meant for task A quietly breaks task B, because you'd have to reread the whole thing to catch it.

The third version shows up downstream, in your own behavior rather than the setup's: you're routinely deleting or ignoring part of what comes back. A run that reliably produces one good paragraph and one paragraph you throw away isn't a setup that's slightly imperfect — it's two tasks' worth of instruction leaking into one output, and you've adapted to it by doing the sorting yourself instead of fixing the setup.

Any one of those three, and it's worth stopping to check. All three together and it isn't really worth checking — you already know.

## The fix, and why the extra setup is worth it

The fix is not a better prompt. It's splitting the overloaded setup back into one setup per task — a separate saved project or context for the status updates, a separate one for the support triage, each with only the instructions, reference documents and examples that job actually needs. Nothing in either one has to hedge, because nothing in either one is trying to also be the other thing.

The objection writes itself: that's two things to maintain instead of one, two places to update when something changes, more setup overhead, not less. It's a real cost, and it's worth naming rather than waving away. But it's the same setup cost the [companion post on building a reusable project](/blog/give-claude-the-context-once-building-a-reusable-project-for-a-repeat-task) already argued is worth paying — it's paid once per task, not once per run. The question was never "should this cost anything," it was "does this task get run often enough that paying the setup cost once beats re-explaining it every time." A second genuinely different task that meets that same bar deserves its own answer to that question, not a discount because a setup happens to already exist nearby.

What that argument doesn't cover is folding the second task into the first one for free. That isn't paying the setup cost once per task — it's paying it once and hoping it stretches to cover two, and the dilution described above is what happens when it doesn't. Two narrow setups, each doing one job well, cost more to build than one setup pretending to do two jobs. They also, measurably, produce output you stop needing to fix.

## Why this matters more than it used to

This isn't only a lesson from watching one setup slowly get worse. It tracks a broader shift happening across how people are building with AI tools this year: the move away from one general assistant loaded up to handle everything, toward narrow tools built for a single job and handed off between each other when a task needs more than one kind of work. A general assistant asked to do five different things is competing against five narrow ones each built and tuned for exactly one of them — and the narrow ones are increasingly winning that comparison, for the same reason a narrow Claude setup beats an overloaded one: nothing in a narrow setup has to serve two masters at once.

You don't need to track that trend closely to act on it. You need to notice it in your own setup, on your own tasks, using the signals above — and treat a second unrelated job showing up in your Claude usage as a prompt to [pick the next task properly](/blog/automating-your-workflows-with-claude-where-to-start) and set it up on its own, rather than as an excuse to bolt it onto whatever you already have running.

One workflow, one job. When you have a second job, build a second workflow. The setup cost is real either way — you're just choosing whether to pay it once, cleanly, or pay it every single run in output you have to fix by hand.
