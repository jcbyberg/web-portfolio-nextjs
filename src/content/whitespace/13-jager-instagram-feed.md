---
title: "The Feed That Keeps a Race Site Alive Between Rounds"
date: "2026-08-29"
type: case-study
client: "Jäger Stockill Racing"
deliverable: "Instagram feed integration, built and hosted"
trim: "Responsive embed, full width"
colour: "RGB, static build refreshed every six hours"
excerpt: "A racing site is judged in the gap between rounds, which is exactly when sponsors go looking. This one pulls the rider's Instagram in and rebuilds itself every six hours, so the homepage keeps up with the season on its own."
tags: ["web", "integration", "instagram", "racing", "cloudflare"]
---

A racing website has a specific problem that most small sites don't. It is judged in the gap.

Between rounds there is nothing new to announce. No results, no entry list, no news. But that is exactly when a sponsor's marketing manager goes looking, because that is when they are doing their planning. They land on a site whose most recent item is dated eleven weeks ago and they draw the obvious conclusion.

Meanwhile the rider is posting to Instagram all the way through.

## The gap between where the content is and where it needs to be

Plenty of young racing programs are already producing content steadily — it just lives on Instagram, while the website sits there like a brochure printed once in March.

The usual fix is a plugin, and on [Jäger's site](https://jagerstockillracing.com) that route was closed. It runs on a managed WordPress host where you don't get to install arbitrary plugins, which is a completely reasonable trade for a client who should not be spending their weekends patching a CMS.

The other usual fix is Instagram's own embed, one post at a time, pasted in by hand. That is not a feed. That is homework, forever.

## Why most Instagram feeds break

Here is the part that catches people out, and it is worth knowing even if you never build one.

**Instagram's image URLs expire.** The links its CDN hands out are signed and time-limited. Any feed that simply points at them looks perfect on the day it is installed and then fills with broken images later, long after anyone was still checking. That is the failure mode to design against, and it is a quiet one: by the time it happens, whoever built the thing has stopped looking at the page.

So this one doesn't point at them. **Every image is copied at collection time and served from the feed's own host, which I run.** No picture on the page depends on a link that is set to expire.

## Static, on purpose

The feed is not fetched when a visitor arrives. It is collected on a schedule, built into the page as plain static HTML, and served from a CDN edge.

That means a visitor's browser makes no call to Instagram at all. Nothing a reader does can hit a rate limit, trip an expired credential, or wait on a third-party script, because by the time they arrive the work is already finished. Whatever has to be dealt with upstream gets dealt with on the schedule, off to one side, where no one is waiting on it. The page is just a page.

Every six hours the whole thing rebuilds itself with whatever is new, and redeploys. A normal refresh needs no manual step.

**The page is also built from the last stored copy of the feed rather than from a live call, so a collection run that comes back with nothing leaves the previous posts in place.** That is the design decision I would defend hardest. A feed that fails to an empty box is worse than no feed at all, because a blank panel on a homepage reads as broken. Going slightly stale is a failure almost nobody notices; going blank is one everybody does.

## It points back, not away

Every post in the feed links to the real thing on Instagram.

The goal is not to keep people on the website. It is to show a visitor that this is an active program, and then hand them a way to follow it. The feed exists to feed the account.

## What the client actually got

The site keeps pace with the account. A sponsor who opens it sees whatever Jäger has been doing lately rather than whatever was true the last time somebody updated the page by hand. Nobody has to be told the program is active, because the page shows it.

And Jäger's side of it is unchanged: post to Instagram the way he already does. Nothing to log into, nothing to copy over, no second content workflow that would quietly stop being used by round three. The website keeps up with him on its own.

That is the whole point. The best integration is the one that stays out of the client's way.

---

## If your site has the same gap

I build these — feed integrations, race sites, sponsor pages and the print and social graphics that go with them, for racing programs and small businesses across Ontario.

If your website's most recent update is older than your last event, that is usually fixable without moving your site or changing how you already post.

**Have a look at the [live feed on Jäger's site](https://jagerstockillracing.com/2026/01/09/the-road-to-racing/)**, then bring me yours.
