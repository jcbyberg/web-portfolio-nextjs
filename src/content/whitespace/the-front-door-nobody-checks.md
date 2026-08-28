---
title: "The Front Door Nobody Checks"
date: "2026-08-28"
type: essay
excerpt: "An organization's website that would not open, and nobody inside knew. The five-minute check that catches it, and why the people who could fix a broken site are the only ones who never see it."
tags: ["websites", "maintenance", "non-profits", "hosting"]
---

I went to look at an organization's website last month. I typed in the address and my browser blocked it. Full-page security warning, red text, the works.

The site wasn't down. Down would have been easier. This was worse, because from the inside everything looked fine.

Here's what was actually happening.

The web address pointed at two different servers, and which one you got was basically luck. Two people in the same room could get different results. Both servers were broken, in two different ways.

The first had a security certificate with the right name on it that **expired over a year ago**. Nobody renewed it. It was set up to renew itself and quietly stopped, the way these things do.

The second had a certificate that worked fine, but with the wrong name on it. It belonged to the hosting company, not the organization. Behind it sat a "Coming Soon" page with a setting switched on that tells Google to ignore the site completely.

Meanwhile the organization had a few thousand followers on social media, was posting regularly, and every post pointed at that address.

## Why nobody noticed

Nobody inside the organization had opened their own website in months. They didn't need to. They already knew what was on it.

The few who did open it got there a different way. A saved bookmark. A browser that already trusted the old certificate. A laptop on the office wifi.

The only people hitting the broken door were strangers. And strangers don't tell you. Nobody emails to say your certificate expired. They close the tab and assume you went out of business.

**The people who could fix it are the only ones who can't see it.**

## Check yours in five minutes

You don't need any tools for this. You just need to stop checking your site the way an insider checks it.

1. **Open it on your phone, on cell data, in a private window.** Not office wifi. Not the laptop you built it on. This one step catches most problems.
2. **Try it with and without the "www."** Those are two different addresses and can point at two different servers. One working doesn't mean the other does.
3. **Tap the padlock and check the certificate's expiry date.** Most are free ones that renew every 90 days. That's twelve chances a year to quietly stop.
4. **Google your own organization.** See what comes up and where it points.
5. **Ask someone outside your organization to open it and send you a screenshot.** Theirs is the only answer that counts.

Do it once a quarter. Put it in the calendar. It takes less time than reading this post.

## Small organizations get hit hardest

A big company has monitoring that wakes someone up at 3am when a certificate expires. A small charity has a volunteer who built the site in 2021, did a nice job, and has since moved away.

That's nobody's fault. The site doesn't break because someone was careless. It breaks because the person who cared moved on, and it kept working just well enough that nobody looked.

We look after sites for community organizations in Durham Region, and this is the most common thing we find. Not bad design. Not thin content. A front door that won't open, in front of a group doing good work that strangers now think has shut down.

Your website talks to people when nobody from your team is in the room. It's worth five minutes every few months to check it's still saying anything at all.

**Open your site on your phone, on data, today.**
