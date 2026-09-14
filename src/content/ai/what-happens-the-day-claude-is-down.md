---
title: "What Happens the Day Claude Is Down"
date: "2026-09-14"
type: "post"
excerpt: "Once a Claude workflow becomes how the task actually gets done, an outage stops being hypothetical. A practical, non-alarmist way to size the plan to what's really at stake."
tags:
  - "Claude"
  - "automation"
  - "workflow"
  - "business ops"
image: "/images/ai/what-happens-the-day-claude-is-down.jpg"
---

![Abstract art of slow aurora-like waves of blue and green light drifting across a deep void, with one small steady point of light pulsing at the center.](/images/ai/what-happens-the-day-claude-is-down.jpg)

Somewhere in the middle of a Claude workflow's life, it stops being an experiment. Nobody announces this. There's no meeting where you decide the weekly status update, the support triage, the report that used to take someone half a day, has become load-bearing rather than a nice-to-have layered on top of a process you could still fall back to. It just happens, quietly, the same way a tool you started using occasionally becomes a tool you reach for automatically — and by the time it's obvious in hindsight, the moment where you could have planned for it calmly has already passed.

The [companion posts in this series](/blog/automating-your-workflows-with-claude-where-to-start) cover picking the right task, setting up context once instead of re-explaining it, deciding how much a human needs to check the output, and keeping one workflow to one job. None of them cover what happens on the day the workflow itself is unavailable — Claude has an outage, your internet drops, there's a billing problem on the account, whatever the actual cause turns out to be. That gap matters more than it looks like it should, because the tasks most worth automating in the first place are exactly the ones that, once handed off, quietly stop having a fallback at all.

This is happening at a larger scale than just your own workflows, too. Across the industry this year, the general shift has been away from AI as something people experiment with on the side and toward something wired directly into how a business runs day to day — fewer novelty use cases, more of the actual operation routed through it. That shift is real and mostly good. It also means the outage question stops being hypothetical for more businesses every month, including ones that never thought of themselves as "an AI company" in any sense.

None of this is an argument that Claude is unreliable, or a claim about any specific outage, uptime record, or incident. It isn't that kind of post, and it doesn't need to be. The argument is narrower and applies regardless of how good the track record is: any tool your business depends on will be unavailable sometimes, for reasons that have nothing to do with whether it's a good tool, and the question worth answering ahead of time is simply what happens on that day.

## The signal that a workflow has crossed the line

You don't need a formal review to find out which of your workflows are load-bearing. There's a concrete, checkable signal, and it comes in two closely related forms.

The first is the direct version: if this workflow vanished for a day, would you be genuinely stuck, or just mildly inconvenienced? Stuck means something doesn't ship, a client doesn't hear back on time, a number that was supposed to go out today doesn't. Inconvenienced means someone grumbles and does it a slower way, or it waits until tomorrow and nothing downstream notices. Those are different situations asking for different answers, and it's worth being honest about which one you're actually in rather than assuming the worse case because the workflow feels important to you personally.

The second signal is subtler and, in practice, catches more workflows than the first one does: does anyone on the team still remember exactly how this task used to get done by hand? Not roughly — exactly. Which spreadsheet, which login, which steps in what order. A task can be genuinely low-stakes if it's late a day and still have crossed into load-bearing territory, because the old manual process it replaced has atrophied past the point of being usable. Nobody deleted it on purpose. It just stopped being exercised, the way any skill does, and one day you'd go looking for the old way and find that the person who knew it left, or simply forgot, eighteen months ago. [The judgment that repetition used to maintain](/blog/is-automating-this-making-you-worse-at-it) doesn't just belong to the person doing the reading — it belongs to the process itself, and a process nobody remembers is a process you don't actually have anymore, whatever the org chart implies.

Run both questions against each workflow you're actually depending on. Most will come back low-stakes on the first question. A smaller number will come back concerning on the second one even when the first one looks fine, and those are the ones worth a real answer.

## What a plan actually looks like — and what it shouldn't

The instinct, once you take this seriously, is to reach for "keep a manual backup for everything, just in case." Resist that. For most of what you've automated, maintaining a parallel manual process defeats the entire point of having automated it — you'd be paying the setup cost of the workflow and the ongoing cost of a fallback nobody uses, for a task where being a day late costs nothing. That's not preparedness, it's just quietly undoing the automation while pretending you haven't.

The honest plan for most tasks is smaller than that, and it's a legitimate plan rather than an absence of one: this waits a day, and nothing breaks. The weekly internal summary, the draft that a person reads before it goes anywhere, the report nobody outside the team sees on the day it's due rather than the day after — for all of these, "it's late" is the whole plan, and writing that down explicitly is more useful than it sounds, because it turns a vague hope into something you actually checked and can stand behind.

A smaller set of tasks genuinely can't absorb a day of silence — the ones tied to a client deadline, a regulatory date, anything where being late has the same shape of consequence as being wrong. For those, the plan has to be specific rather than aspirational: who does this by hand if the workflow is down, using what tool or template, and — tying back to the atrophy question above — do they actually still remember how. A plan that names a person but not a method isn't a plan, it's a hope that someone will figure it out under pressure, and pressure is exactly when people don't.

## Checking the plan is real, not assumed

Having answered these questions once doesn't mean the answers stay true. Tasks migrate from the "waits a day" bucket into the load-bearing one without anyone deciding that on purpose, which is the same drift that created this problem in the first place. The fix isn't a formal audit — it's a habit as cheap as the ones the rest of this series has argued for: periodically, for each workflow that matters, actually ask "if this vanished today, what would happen in the next 24 hours," and pay attention to how confidently you can answer it.

A clear, specific answer — "nothing, it waits" or "so-and-so pulls the report manually from the source system, they did it last month" — means the plan is real. A vague one — a shrug, a "someone would figure it out," a pause before the answer — is the actual signal to act on. Not a reason to feel briefly uneasy and move on, but the trigger to write the plan down properly before the outage does the asking for you. That's the whole exercise: not predicting when Claude will be down, just making sure that whenever it is, the answer to "what happens now" is something you already decided rather than something you're improvising in front of a client.
