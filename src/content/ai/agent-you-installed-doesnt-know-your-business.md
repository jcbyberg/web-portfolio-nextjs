---
title: "The Agent You Installed Still Doesn't Know Your Business"
date: "2026-09-14"
type: "post"
excerpt: "Pre-built agent-persona libraries like agency-agents put 200-plus specialists a click away. The costume is generic; the part that actually protects your business is the exceptions you still have to write yourself."
tags:
  - "AI agents"
  - "Claude Code"
  - "automation"
  - "business ops"
image: "/images/ai/agent-you-installed-doesnt-know-your-business.jpg"
---

![Abstract art of a horizontal row of identical hollow translucent glass masks glowing mint green and periwinkle blue in dark navy space.](/images/ai/agent-you-installed-doesnt-know-your-business.jpg)

## The 200-agent roster you can install with one click

There's a GitHub project called [agency-agents](https://github.com/msitarzewski/agency-agents), built by developer Mateusz Sitarzewski, that bills itself as "a complete AI agency at your fingertips." It's a roster of 200-plus agent personas — a frontend specialist, a Reddit community manager, a security reviewer, a "whimsy injector," a "reality checker" — each one a pre-written system prompt with a name, a personality, a set of processes, and a description of what it's supposed to deliver. It ships a native app for macOS, Linux and Windows that browses the roster and drops any of them straight into Claude Code, Cursor, Codex, Gemini CLI and a dozen other agentic tools. No cloning a repo, no copy-pasting a prompt file, no writing your own. Pick an agent, click install, it's live in your tool of choice.

It's popular for a reason. Writing a good agent persona from scratch is real work, and most of us are bad at guessing what we'll actually need until we've hit the wall a specific persona would have caught. A library like this compresses months of "huh, I should have told it to always check X" into somebody else's finished file. For a lot of coding tasks, that's a legitimate shortcut and worth using.

But it's worth being precise about what that shortcut actually buys you, because the part that gets marketed — the personality, the 200-agent roster, the one-click install — is not the part that does the work.

## What a persona is actually made of

Strip an agent persona down and it's two different kinds of instruction stacked on top of each other.

The first kind is generic domain expertise: "you are a senior frontend engineer who cares about accessibility and writes semantic HTML," or "you are a security reviewer who checks for injection, auth bypass, and secret leakage." This is useful, but it's also close to what the underlying model already knows. A frontier model already writes reasonably semantic HTML and already knows the OWASP list without being told it's a security reviewer first. The persona mostly repackages baseline competence the model already has, in a costume.

The second kind is specific, situated knowledge that only exists because someone did the task badly first and wrote down what they learned: *this client's returns policy is 30 days except for the clearance category, which is final sale — check the SKU prefix before promising a refund.* *Our staging environment silently swallows a specific header, so a passing local test means nothing here.* *This vendor's part numbers repeat across two unrelated product lines — always confirm the category before matching one.* Nobody ships that in a public library, because it isn't generic. It's the scar tissue of one specific business, one specific codebase, one specific set of mistakes already made.

The costume is what a persona library sells. The scar tissue is what actually changes the output.

## The test: would a generic version of this agent embarrass you?

Here's a practical way to draw the line, rather than treating "install a pre-built persona" as either always fine or always lazy.

Ask what happens if the installed persona runs with zero knowledge of your actual business — your actual client roster, your actual style rules, your actual failure modes — and only the generic domain competence printed on the label.

For a lot of coding work, the answer is: nothing bad happens. A "refactor this function for readability" agent, a "write unit tests for this module" agent, a "review this diff for obvious bugs" agent — these tasks are close enough to the training distribution that a well-written generic persona is genuinely most of the value. This is exactly the territory agency-agents is strongest in, and installing one there is a good trade: minutes of setup for a competent starting point.

For anything that touches a real client, a real inventory, a real published claim, or a real dollar amount, the answer is usually: something bad happens, quietly. The installed persona will confidently apply the generic version of a rule your business doesn't follow, because it has no way to know your business doesn't follow it. It won't know your return policy has an exception. It won't know which vendor's data is unreliable. It won't know the one client who insists their layout never gets creative additions. Nothing in the persona's system prompt was ever going to contain that, because the persona was written to serve everyone who installs it, and your exceptions are, definitionally, not everyone's.

## Install the shell, write the exceptions yourself

The practical move isn't "never use a pre-built persona" — that throws away a real time savings on the half of the work that's genuinely generic. It's treating the installed persona as a skeleton, not a finished agent, for anything that touches your actual business rather than a generic coding task.

Install the roster entry that's closest to the role you need. Then, before you trust it with anything real, add the layer the library can't sell you: the specific rules, the specific exceptions, the specific things that have already gone wrong once and taught you something. That's the same "give it the context once" work worth doing for any repeat task — the persona library just changes where you start from, not whether the step is optional.

The tell that you've skipped it is subtle, because a generic persona doesn't fail loudly. It produces output that's fluent, confident, and structurally correct — and wrong in exactly the place your business is different from the average business the persona was written for. That failure mode doesn't show up in a demo. It shows up three weeks later, in a client's inbox, when nobody happened to be watching that particular output.

A 200-agent roster is a genuinely useful shortcut for the parts of the work that are the same for everyone. It was never going to be a shortcut for the parts that are yours.
