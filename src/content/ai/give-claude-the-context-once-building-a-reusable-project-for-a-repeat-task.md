---
title: "Give Claude the Context Once: Building a Reusable Project for a Repeat Task"
date: "2026-09-13"
type: "post"
excerpt: "A practical setup guide: what instructions, reference files, and examples go into a reusable Claude project so you stop re-explaining the same task every week."
tags:
  - "Claude"
  - "automation"
  - "workflow"
  - "productivity"
---

The companion piece to this post, [Automating Your Workflows With Claude: Where to Start](/blog/automating-your-workflows-with-claude-where-to-start), is about picking the right task and getting into the habit of front-loading context instead of re-explaining it every time. This one is about the setup itself — what actually goes into it, walked through on one task, so you can build your own rather than guess at the shape of it.

## The one-off prompt versus the reusable setup

If you've used Claude for a single task — summarize this document, draft a reply to this email, reformat this list — you've probably written a paragraph of instructions, gotten a result, and moved on. That's fine for something you'll never do again. The moment a task repeats, that same paragraph becomes a tax: you retype it, or you hunt through your chat history for the last version, or you just wing it and get a slightly different result every time.

A reusable project (Claude Projects, or any equivalent saved-context workspace) solves that by giving the task a permanent home. You set it up once — instructions, reference material, examples — and every future run starts from that same foundation instead of a blank page.

## What actually goes into the setup

Three things, and none of them are complicated.

**Custom instructions.** This is a written description of the task and the output you want, saved so you don't retype it. Not "help me with my weekly update" but the specifics: what sections the output should have, roughly how long it should be, what tone it should be in, and — this matters more than people expect — what to do when the input is incomplete or ambiguous. Should it flag the gap, make a reasonable assumption and say so, or leave a placeholder? Deciding that once, in writing, is what keeps the output consistent instead of drifting based on how the request happened to be phrased that day.

**Reference documents.** Two to four files that show the task's context, not a full knowledge base. If the task involves writing something, this is a past example or two of output you were actually happy with — the closest thing to a style guide you have. If the task involves categorizing or extracting, it's a short list of the categories or fields that matter and what distinguishes them. If your business has specific terms, product names, or people that show up regularly, a short glossary earns its place here. The test for whether something belongs in this set: would handing these same three or four documents to a new hire, with no other explanation, let them do the task close to the way you want it done? If yes, that's your reference set. If you need ten documents to explain it, the task itself is probably too broad to hand off yet.

**A statement of what not to guess.** This is the one people skip, and it's the one that prevents the most damage. Some inputs have to come from you every time — this week's numbers, this week's transcript, the specific names involved, anything that changes week to week rather than staying fixed. Write down, explicitly, that these are supplied fresh each time and are never to be inferred or carried over from a previous run. Without that line, a saved project will quietly reuse whatever it last saw, or invent something plausible-sounding to fill the gap, and a plausible invention is far more dangerous than an obvious blank, because nobody stops to check it.

## Walking through one task

Take a hypothetical here — not a real client, just a shape of task common enough that the specifics will map onto plenty of others: drafting a weekly status update from a pile of raw notes (meeting minutes, a few Slack messages, half a to-do list) into a clean summary for a manager or client.

Setting it up looks like this. The custom instructions describe the format: three sections — progress, blockers, next steps — each a short paragraph or a few bullet points, written in plain language rather than jargon, and a line at the top stating explicitly that anything unclear in the source notes gets flagged rather than smoothed over. The reference documents are two or three past updates you were genuinely happy with, so the tool has real examples of the tone and length you're after, plus a one-page glossary of the two or three project names and abbreviations that show up every week so they don't get mangled or expanded incorrectly. The "don't guess" line states plainly that this week's raw notes are supplied fresh every time and nothing from a previous week's status should carry forward unless it's explicitly still true and restated in the new notes.

From there, running it weekly means opening the saved project and pasting in that week's notes — nothing else. No re-explaining the format, no re-pasting the glossary, no describing the tone again. The setup already has all of that. What changes is only the input.

## How you know it's working

The signal isn't a single perfect output on day one. It's the trend across the first several runs: the amount of editing you have to do before the output is usable should shrink. The first run might need real rewriting — a section reordered, a term corrected, a paragraph shortened. If the second and third runs need less of that, and the corrections start clustering around the same one or two things, that's useful information — it tells you exactly what to add to the instructions or the reference documents so that correction stops being necessary. A reusable setup that never improves after repeated use usually means the instructions were never actually updated after the first miss, not that the approach doesn't work.

What doesn't go away, and shouldn't, is a human check on anything that leaves the building or touches a fact someone could be held to — a number, a date, a commitment, a name spelled correctly. A saved project makes the first draft faster and more consistent. It doesn't make the output trustworthy without a read-through, and treating it as if it does is how a small error in a routine weekly update turns into something a client actually sees.

The setup cost is real, but it's paid once per task, not once per week. Everything after that first investment is just supplying the part that actually changes.
