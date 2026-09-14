---
title: "The Free API Is Not the Expensive Part"
date: "2026-09-14"
type: "post"
excerpt: "Picking a free API is the easy part. The real cost shows up later: breaking changes, rate limits at scale, and quiet shutdowns you never planned for."
tags:
  - "APIs"
  - "automation"
  - "workflow"
  - "business ops"
image: "/images/ai/the-free-api-is-not-the-expensive-part.jpg"
---

![Abstract art of a smooth glowing blue orb with fine hairline cracks quietly forming across its surface.](/images/ai/the-free-api-is-not-the-expensive-part.jpg)

## The decision that isn't the hard part

Say you need to validate a mailing address, pull a currency conversion rate, or check the weather for a route-planning feature. You go looking for an API, and you find one fast. GitHub hosts a project called [public-apis](https://github.com/public-apis/public-apis) — a community-maintained, plain-language list of free APIs, organized into categories like geocoding, weather, currency, email validation, and dozens more. It has drawn something in the neighborhood of half a million stars, which is a reasonable proxy for how many people have gone looking for exactly this and landed there.

Most of what is listed works the way you would hope. You get an API key in under a minute, the documentation has a working example you can paste into a terminal, and within an hour your workflow is calling a real endpoint instead of a placeholder. For the specific decision of "which free API do I use for this," that is honestly most of the story. It is low-stakes and low-effort, and if you have been putting off wiring one in because you are worried about picking the wrong provider, stop worrying about that part. Swapping one geocoding endpoint for another later is rarely more than an afternoon.

That ease is exactly what makes the rest of this worth saying out loud, because it is easy to mistake "the API was simple to add" for "the risk is behind me." It isn't. The free API is the cheap part of this project. The expensive part shows up later, and it shows up on a day you didn't pick.

## Where the real cost actually lives

None of the risk here is about whether the API works today. It obviously does — you just tested it. The risk is about what happens between today and the day, six or eighteen months from now, when something about it changes and your workflow was never built to notice.

**The response shape changes without warning.** A free API maintained by a volunteer or a small team does not run the same release process a vendor with a support contract runs. A field gets renamed, a nested object gets flattened, a value that used to be a number comes back as a string. There is often no changelog, no deprecation notice, and no migration guide — just a different response the next time your code happens to call it. If your workflow assumed the shape would hold, it breaks quietly, and depending on what downstream step reads that field, it can break in a way that produces a wrong answer instead of an error. A wrong answer is worse than a crash, because nobody goes looking for it.

**Rate limits only bite at real scale.** Free tiers are generous for testing and thin for production. The limit that felt irrelevant when you were making a handful of calls a day during development becomes the thing throttling your workflow the week it actually matters — a busy Monday, a marketing push, a month-end batch job that suddenly has three times the normal volume running through it. You find the ceiling by hitting it, usually during the exact period when the workflow is under the most load and you have the least patience to debug it.

**The project itself can just stop.** A company API has an SLA, a deprecation timeline, and someone whose job depends on giving you notice. A free API on a list like public-apis is frequently a side project, a research grant that ran out, or one maintainer's spare time. It can go read-only, get rate-limited into uselessness, or disappear entirely, and the notice — if there is one — might be a single line in a GitHub issue you never saw. None of that is a knock on the people who build and maintain these things for free. It is just a different risk profile than a paid vendor, and it is worth naming plainly instead of assuming "free and popular" means "stable."

None of these are exotic failure modes. They are the ordinary lifecycle of a small, free, actively-used project, and if your workflow calls that project's endpoint from a dozen places with a dozen slightly different assumptions about the response, every one of those risks becomes a debugging session instead of a five-minute fix.

## The low-effort fix that actually holds up

You do not need a vendor evaluation process or a contract review to protect yourself here. You need one habit, applied before the integration ships rather than after it breaks.

Put the API call behind a single function or module — one place in your codebase that knows how to talk to that specific API, and nowhere else. Every other part of your workflow calls that function and gets back a plain, predictable shape that your code defines, not whatever the API happens to hand back that day. When the provider renames a field or restructures a response, you have exactly one place to fix it, and everything downstream keeps working unmodified. Without that boundary, a breaking change turns into a search-and-replace across however many places you copy-pasted the original call, and you will not remember all of them.

Inside that same function, decide now — not the day it happens — what your workflow does when the call fails or comes back empty. Does it retry once and then fall back to a cached value? Does it skip that record and flag it for a human instead of guessing? Does it halt the batch rather than write a wrong result into your system of record? Any of those can be the right answer depending on what the workflow feeds into, but "assume it always succeeds" is the one answer that is guaranteed to be wrong eventually, and it is also the default you get for free if you don't decide anything at all.

Neither of these takes long. Wrapping a call in a function is minutes of work if you do it while you are already writing the integration. Deciding what "no data" means for your workflow is a five-minute conversation, not a design document. The reason this is worth doing at all is not that the free API is untrustworthy — most of them are fine, most of the time — it's that you are building on infrastructure you don't control and can't get an SLA from, and the fix costs almost nothing compared to what it saves you the first time the response shape moves under your feet.

## Pick the API. Just don't assume it forever.

There is a version of this advice that reads as "avoid free APIs," and that is not the point. The point is the opposite: the free API is genuinely the easy, low-stakes choice, so make it quickly and move on. Spend the effort you saved on the part that actually determines whether the integration survives contact with reality — one seam between your workflow and the provider, and a real answer for what happens when the provider doesn't behave the way it did in your first test. That's the difference between a workflow that needs a five-minute patch in a year and one that needs to be rebuilt from scratch the day a free service you never thought about again quietly changed.
