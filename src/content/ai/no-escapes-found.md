---
title: "NO ESCAPES FOUND"
date: "2026-08-30"
type: post
excerpt: "A security review came back clean, confident and well-structured. It would have satisfied my commit gate. It had never run anything at all."
tags: ["ai agents", "security", "verification"]
---

## The commit was blocked before I even asked

I ran `git commit` and it refused. Not because anything was broken — because there was no review artifact on disk keyed to the hash of my staged diff.

That is a rule I set for myself: no agent marks its own work complete. A different model family reviews the diff, or a deterministic gate passes — the test suite, the type checker, an actual run of the thing — before anything gets committed. A pre-commit hook enforces it, so I cannot talk myself out of it on a Friday afternoon.

What I was shipping was a Cloudflare Worker that reverse-proxies a marketing site onto a subdomain. Small in scope. The kind of thing that is easy to wave through.

I was not in the mood to wave anything through, because of what had happened the day before.

## What was still live one day earlier

A sibling worker had an open redirect. The bug was almost boring in how simple it was. The code stripped a section prefix off a URL, and when the input was `/whitespace//evil.com`, stripping `/whitespace` left `//evil.com`. A browser reads that leading double slash as protocol-relative — an instruction to go and fetch a different origin entirely. Put it in a `Location` header and you have built an open redirect for free.

That code had been reviewed. A reviewer read it, reasoned about it, and cleared it. The reviewer was wrong, and the bug was live in production when I found it.

So I already knew the failure I was defending against: a reviewer that inspects code and forms a confident opinion instead of running it. I wrote the brief for the new worker accordingly. Execute the functions, do not reason about them. Report only inputs you actually ran and the outputs you actually got.

I thought that was enough. Being wrong about *why* it wasn't is the whole story.

## Four tries to get a review

Codex, on gpt-5.5, hit its usage limit. I tried three times, thinking it might reset. It never ran.

A Gemini-hosted lane took the full brief and timed out mid-review. What it left behind was a skeleton — the shape of a report, headings and sections, nothing filled in. No verdict. At least it was obvious about not finishing.

Then a gpt-oss-120b lane, given a tightened single-concern version of the same brief, came back fast, and came back good. Fluent. Well-organised. It described a test methodology. It stated the failure criterion — the same open-redirect shape from the day before — correctly, in its own words. It concluded, cleanly: no escapes found.

I almost took it.

A fourth attempt, a Sonnet subagent, hit a session rate limit and terminated early.

## What was not in the transcript

Before acting on that verdict I went and read the agent's own transcript — the raw log of what it did before writing the report. I was looking for evidence of a run. A script written to disk. A `node` invocation. Test inputs. Actual output.

I grepped it for `node ` and `evil.com`. One match. It was inside the conclusion, in a sentence describing what the agent said it had tested. Nowhere else. No script. No execution. No inputs. No outputs.

It read exactly like a careful review, because that is what it had been asked to produce — and producing that document turned out to be a task it could complete without doing any of the underlying work.

I deleted it.

## Why a confident report is worse than a refusal

Consider what almost happened. The pre-commit hook does not read English. It checks that a review artifact exists and is keyed to the hash of the staged diff. That report satisfied the letter of the gate completely: a real file, correctly named, describing a review of the correct diff, reaching a definite verdict.

Three of the four attempts failed loudly — a quota error, a timeout, a rate limit. Those are cheap to notice. The one that failed quietly was the one that succeeded on paper.

A loud failure leaves the door open: you notice, and you go and find another way to check. A clean verdict in polished prose closes it, because nobody goes back to re-check something already checked.

A gate that accepts a document as proof of work can be satisfied by a document. The artifact was never evidence of a review. It was a *description* of a review — and description is precisely what a language model is built to produce on demand, whether or not the thing described took place.

## What actually fixed it

The brief that worked was nearly identical to the one that had just failed. I added one line: you must actually run a script and paste the real stdout; if you cannot, write COULD NOT EXECUTE and stop.

That produced a real run. Eighty-five cases, with the output pasted in rather than summarised: percent-encoded slashes, backslashes, tab and newline and carriage return and null bytes, an `@` smuggled into the userinfo part of the URL, Unicode lookalike slashes — U+2044 and U+FF0F — and slash runs ten and twenty deep. Eighty-five inputs and eighty-five outputs, sitting there where I could read them myself.

It found a defect I had missed. One branch of the function — the one handling an already-absolute URL — was the only path that did not collapse leading slashes the way the rest did. `https://joshbyberg.com/ai//evil.com` came out as `https://ai.whitespacedesign.ca//evil.com`. Not an origin escape, because that hostname is built from a fixed internal list rather than taken from the input, but the same shape as the bug that had been live the day before, and it would have 404'd a real visitor.

The difference was not capability. The brief now made "I ran this, here is the output" the only thing that counted as done, and gave the model an honest way to say it could not.

## What I changed

Demand an artifact that could not exist unless the work happened. A summary of a security review can be written by anything that has seen enough security reviews, including a model that never opened the file. Real stdout from a script that has to be constructed correctly to run at all is a different kind of object.

Give the agent a legitimate way to fail. `COULD NOT EXECUTE` has to be an acceptable answer, stated up front. Without one, the cheapest remaining path is to produce something shaped like success.

Then check the transcript, not the conclusion. Consensus is not verification either — two agents agreeing proves nothing about a falsifiable claim, and *does this function let user input escape to another origin* is about as falsifiable as they come. Run the code, call the API, read the file yourself.

The diff went in covered by 36 unit tests and 197 adversarial cases: 112 I wrote, 85 from the review that actually ran. The number I keep thinking about is the one from the review that did not — a report of unknown length, describing a methodology it never followed, that I came within one `grep` of believing.
