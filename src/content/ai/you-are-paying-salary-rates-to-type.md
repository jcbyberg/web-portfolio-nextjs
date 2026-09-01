---
title: "You Are Paying Salary Rates to Type"
date: "2026-08-30"
type: "post"
excerpt: "Nobody has data entry in their job title, so nobody has ever costed it. Here is what a week of typing actually costs, the three questions that decide whether it is worth automating, and the jobs where it is not."
tags:
  - "automation"
  - "business ops"
  - "data entry"
  - "cost"
  - "ROI"
image: "/images/ai/you-are-paying-salary-rates-to-type.jpg"
---

![Two hands typing on a laptop keyboard at a white desk.](/images/ai/you-are-paying-salary-rates-to-type.jpg)

Nobody has "data entry" in their job title. That is exactly why it costs so much.

It arrives as a favour. A supplier sends a price list and someone retypes it. A form goes up and someone copies the submissions into the CRM. A system gets replaced and the old records have to come across by hand. None of it was ever budgeted, none of it appears on an org chart, and all of it is being done by someone you hired to do something else.

So when I ask a business what their data entry costs, the honest answer is usually that nobody has ever worked it out.

## What a week of typing actually costs

Work it out once and it stops being invisible.

Take a real shape of job: a parts dealer loading a supplier catalogue. Several hundred pages of part numbers, sizes, prices and fitment charts, published once a year, five suppliers deep. Somebody sits down with two windows open and types. Realistically that is a week of a person's time per supplier publish — and it lands five times a year.

Five weeks. Call it a $55,000-a-year employee and you are spending somewhere north of five thousand dollars a year to move numbers from a PDF into a database. That is the small part.

The larger cost is the one nobody invoices for:

- **It is not what you hired them for.** Those five weeks came out of the job you actually needed done — merchandising, ordering, talking to customers. You paid for the typing, and you paid again by not getting the other thing.
- **The errors do not announce themselves.** A part number is meaningless. `0611-0451` is not more plausible than `0611-0431`, so when someone fat-fingers it, nothing anywhere notices. You find out months later, when a customer cannot order a product that looks perfectly fine in your catalogue.
- **It sets the pace of the business.** If loading a catalogue takes five weeks, you load catalogues five weeks slowly. The price update that should have gone out in March goes out in May.

The typing is the cheapest part of data entry. The delay and the silent errors are the expensive part.

## The three questions that tell you if it qualifies

Not every manual job is worth automating, and the ones that are worth it share a shape. Ask three things about the work in front of you.

**Is it the same job every time?** Not similar — the same. Same source format, same destination fields, same rules about what goes where. A catalogue load is the same job every time. "Handle whatever comes into the shared inbox" is not, and it will cost you three times as much to automate badly.

**Is there enough of it?** Volume is what pays for the build. A job you do twice a year for an afternoon is a job you should keep doing by hand. A job that eats a week, five times a year, has already paid for a pipeline several times over and nobody noticed.

**Can you tell when the output is wrong?** This is the one people skip, and it is the one that decides whether the thing survives contact with reality. If a wrong answer is visibly wrong, automation is straightforward. If a wrong answer looks exactly like a right answer — as it does with part numbers, account codes, SKUs — then the system has to be built to flag its own uncertainty, or you have simply automated the production of errors.

Three yeses and you have a candidate. Two and you have a maintenance burden.

## What it costs to replace

Here is the part the AI vendors are vague about, so I will be specific.

I built the pipeline for the catalogue job described above. It runs sixteen catalogues across five distributors — about 102,000 variant rows and 65,000 distinct part numbers. It was a few weeks of build, not a six-month IT programme, and once it exists a catalogue load is an afternoon of review rather than a week of typing.

But the money only works because of how the work is split, and this is where most projects go wrong.

**The language model does almost none of it.** The part numbers are pulled deterministically — out of the geometry of the page, with per-supplier rules and an explicit filter for the things that look like part numbers and are not, such as model-year ranges. That code is cheap to run, inspectable, and wrong in ways you can see. A model is used for exactly one job in the whole pipeline: reading the fitment charts, which are genuinely a comprehension problem. One job, chosen deliberately.

That split is also the cost story. Running a language model over 102,000 rows is a real bill, every single time you run it. Running a parser over 102,000 rows costs nothing. "AI does your data entry" is expensive. "A pipeline does your data entry and calls a model for the one hard part" is a rounding error.

**Most of the build is not the AI at all.** Of the five distributors, exactly one publishes a file you can download. The rest deliver JavaScript page-turners that stream one image per page. Getting hold of the catalogue in the first place was most of the work, and no model in the world helps with it.

**Confidence scores are what make it usable.** The pipeline scores its own output and sorts 102,000 rows into the ones you can push without looking and the few hundred worth a human's attention. Nobody is going to check sixty-five thousand part numbers. Everybody will check four hundred. That single feature is the difference between a tool that gets used and a tool that gets abandoned in month two.

I have written up how that pipeline actually works, including where it refuses to use AI and why, in [65,000 part numbers, and almost no AI](/blog/automating-data-entry-with-ai).

## The jobs where this does not pay off

I would rather tell you this now than after you have spent the money.

**Low volume.** If the job takes an afternoon twice a year, automating it is a hobby. Keep typing.

**A moving target.** If the source format changes every time — a different supplier, a different layout, a new set of rules — you are not automating a process, you are creating a permanent maintenance job. Some of those are still worth it. Most are not.

**Judgement disguised as data entry.** Plenty of "just typing" jobs are actually someone quietly deciding things: which of these two records is the real customer, whether this invoice is the one we already paid. Automate the typing and you delete the decision, and nobody notices until it matters.

**Anything unverifiable and high stakes.** If a wrong value cannot be spotted and the consequence is money or safety, the honest answer is a system that flags rather than one that decides.

## What actually gets replaced

Not a person's job. The part of a person's job that was never really a job.

Nobody was hired to retype part numbers out of a PDF. It accumulated, the way this work always does, until it was eating a week every time a supplier published. What automation gives back is that week — and what remains is the part that needed a person anyway: deciding what to stock, what to price it at, and which of the four hundred uncertain rows is actually wrong.

The finish line is not "the AI does our data entry." It is that nobody on your payroll is spending Tuesday retyping a PDF, and that when something does come out wrong, the system tells you — quickly, and before your customer does.

---

*If your team is losing days to a job like this — catalogue loads, price updates, form-to-CRM copying, spreadsheet-to-system transfers — [tell me what it is](/bring-your-idea-to-life). I will work out what it is costing you, and tell you honestly whether it is worth automating.*
