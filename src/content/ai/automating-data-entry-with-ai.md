---
title: "65,000 Part Numbers, and Almost No AI"
date: "2026-08-30"
type: post
excerpt: "Loading a supplier catalogue into Magento is the data-entry job everyone wants to throw an LLM at. Here is what actually did the work across 16 catalogues and 102,000 rows — and the one place the AI earned its keep."
tags: ["automation", "magento", "data extraction", "ecommerce", "workflow"]
image: "/images/ai/automating-data-entry-with-ai.jpg"
---

![A close-up of a motorcycle engine — cooling fins, cylinder head and cabling.](/images/ai/automating-data-entry-with-ai.jpg)

A powersports dealer sells parts from five distributors. Each distributor publishes a catalogue once a year — several hundred pages of part numbers, sizes, prices and fitment charts. To sell any of it online, somebody has to get all of that into Magento.

Traditionally that somebody is a person with two windows open, typing. It is the purest form of data entry: no judgement required, no creativity possible, and no way to do it quickly without making mistakes.

So it is exactly the job people now want to hand to an LLM. Feed it the catalogue PDF, ask for JSON, push the JSON into Magento.

I built the pipeline that does this. It covers 16 catalogues across five distributors — about 102,000 variant rows and 65,000 distinct part numbers. And the LLM does almost none of the work, on purpose.

## The part everybody skips

Before you can extract anything, you have to *have* the catalogue, and that turns out to be most of the job.

Of the five distributors, exactly one publishes a file you can download. The others deliver:

- **FlippingBook viewers** — three of them. The catalogue is not a document, it is a JavaScript page-turner that streams one SVG per page as you click.
- **A HTML webstore** plus **34 separate flipbook catalogues** on a CDN.

None of them wants a robot reading it. Headless browsers get blocked outright, so the harvester drives a real Chrome over the debugging port — the same browser a person uses, at a person's pace, with randomised delays and reading pauses. It caches every asset it touches so a page is only ever fetched once, and it stops dead on a 403 or 429 rather than hammering a supplier who has just asked it not to.

That is the unglamorous eighty percent. No model in the world helps with it.

## Why the obvious approach quietly fails

Here is the pitch you have read a hundred times: LLMs handle unstructured data, so stop writing brittle parsers and just ask the model for the fields.

It is true right up until the thing you are extracting is a part number.

A part number has no meaning. `0611-0451` is not more plausible than `0611-0431`. There is no context, no grammar, and no sanity check — which means when a model reads it wrong, nothing anywhere in the system notices. You do not get an error. You get a Magento catalogue with a product nobody can order, sitting next to forty thousand that work, and you find out when a customer complains.

The same page contains model-year ranges like `2019-2024`, which look exactly like part numbers and are not. A language model is happy to hand you either.

So the part numbers do not go anywhere near a language model. They come from the geometry of the page: positioned text out of the SVG transform matrices, or spans out of the PDF, with per-supplier rules about what a part number looks like for *that* supplier, and an explicit filter for the year ranges. Deterministic, inspectable, and wrong in ways you can see.

This is the principle I keep coming back to. **Reach for the narrow tool before the clever one.** A pattern that only matches digits can misread a value, but it can also *abstain* — and an abstention is a row you go and check. A language model never abstains. It is fluent in every direction, including the wrong one.

## Where the model actually earns its place

There is one part of these catalogues that defeats the deterministic approach completely: the application chart.

That is the grid showing which bikes a part fits — makes down one axis, years across the other, marks in the cells. It is a picture of a table, rendered differently by every supplier, and there is no reliable geometry to exploit. Reading it is genuinely a comprehension problem.

That is where a vision model goes. The page image gets composited with its text layer and sent for structured fitment extraction, and it is good at it — because this is the shape of problem these models are actually good at: ambiguous input, tolerant of a near-miss, and checked by a human before it matters.

One job, chosen deliberately. Not the whole pipeline.

## What makes the output usable

Extraction is not the finish line. Magento does not want rows, it wants products — and a glove that comes in five sizes is one configurable product with five children, not five unrelated items.

So variants get grouped into simple and configurable products, and every product carries two things that matter more than they sound:

- **Provenance.** Which catalogue, which page, which row of text it came from. When something looks wrong you can go and look at the page it came from, rather than guessing.
- **A confidence score.** Not everything groups cleanly, and the pipeline says so instead of pretending.

That confidence score is the difference between a tool somebody uses and a tool somebody abandons. It sorts 102,000 rows into the ones you can push without looking and the few hundred worth a human's attention. Nobody is going to check sixty-five thousand part numbers. Everybody will check four hundred.

The end of the line is a Magento CSV — simple products, or configurable parents with their children keyed on size — which imports the way Magento expects.

## What this actually replaces

Not a person's job. The part of a person's job that was never really a job.

Nobody was hired to retype part numbers out of a PDF. It accumulated, the way this work does, until it was eating a week every time a supplier published. What the pipeline gives back is that week — and the part of the work that remains is the part that needed a human anyway: deciding what to stock, what to price it at, and which of the four hundred uncertain rows is actually wrong.

The catalogue still has to be right. It just no longer has to be typed.

---

*If your team loses a week to a job like this — catalogue loads, price updates, spreadsheet-to-system transfers — [tell me what it is](https://ai.whitespacedesign.ca). I will tell you honestly whether it is worth automating.*
