# Off-site SEO setup

Two things that cannot be done from this repo, prepared here so they are a
copy-paste exercise rather than a research exercise. Both need Josh at a browser.

---

## 1. Search Console — one property per brand domain

**Why this is first.** Neither `whitespacedesign.ca` nor `racedad.ca` has a
Search Console property today, so there is currently zero visibility into how
either performs — no impressions, no queries, no indexing status, no way to tell
whether the canonical consolidation worked. Set this up *before* the cutover, so
there is a baseline to compare against.

Expect a dip for a few weeks after cutover while Google re-resolves which URL to
index. That is normal and is not a reason to revert; the point of having the
property is being able to watch it recover.

### Use a Domain property, not a URL-prefix property

Verify by **DNS TXT record**, not the HTML-tag method. Three reasons:

- it covers `www.` and every subdomain (including `media.racedad.ca`) in one property
- it survives the proxy — an HTML meta tag would have to be injected through the
  worker, and the worker now deliberately *strips* verification tags, because
  serving joshbyberg.com's Google and Facebook tokens on a brand domain is exactly
  the bug we just fixed
- it does not break if the hosting or proxy arrangement changes

### Steps

1. https://search.google.com/search-console → Add property → **Domain**
2. Enter `whitespacedesign.ca` (no scheme, no `www`)
3. Google shows a TXT record like `google-site-verification=<token>`
4. In Cloudflare DNS for that zone: add a TXT record, name `@`, value = the full
   string Google gave you
5. Wait for propagation (usually a minute or two), then click Verify
6. Repeat for `racedad.ca`
7. In each property: **Sitemaps → Add a new sitemap → `sitemap.xml`**
   - whitespacedesign.ca/sitemap.xml → 20 URLs
   - racedad.ca/sitemap.xml → 48 URLs
8. Use **URL Inspection** on one post per domain and request indexing, to prime it

### Worth checking a week later

- Coverage: the brand URLs indexed, and the `joshbyberg.com/whitespace/*` and
  `/race-dad/*` copies dropping out as "Alternate page with proper canonical tag"
  — that message is the signal the consolidation worked
- That no legacy `/NN-slug/` URL is reported as a 404 (the worker's 301 map
  should catch all 29)

---

## 2. Google Business Profile

Google Business Profile signals are roughly a third of what decides local-pack
ranking, and it is entirely off-site — no amount of work in this repo substitutes
for it. For a design and web practice serving Durham Region this is likely the
single highest-leverage item in the whole plan.

### Before you start — one thing is missing

**There is no phone number anywhere in the codebase.** GBP effectively requires
one, and the number must then match everywhere else it appears (this is the NAP
consistency rule — Name, Address, Phone identical across every listing; even
"Street" vs "St." counts as a mismatch).

Decide the number first, then add it to `src/app/layout.js` in the
`ProfessionalService` schema as `telephone`, so the site and the profile agree
from day one.

### Set it up as a service-area business

Josh works from Oshawa without a storefront customers visit, so: enter the
address during setup for verification, then **hide it** and define service areas
instead. A hidden address is normal for this business type and does not hurt
ranking.

### Fields, ready to paste

**Name** — `Josh Byberg — Web Design & Graphic Design`
Use the real business name only. Do not append keywords ("Oshawa Web Design
Company"); keyword-stuffed names are a common cause of suspension and are
reportable by competitors.

**Primary category** — `Website designer`

**Secondary categories** — `Graphic designer`, `Web hosting company` *(only if
actually offered)*, `Advertising agency` *(only if it fits how the work is sold)*
Keep secondaries honest and few; irrelevant ones dilute relevance rather than
adding reach.

**Service areas** — matching `SERVICE_AREA` in `src/app/oshawa/offer-config.js`
and `areaServed` in `src/app/layout.js`, so all three agree:

> Oshawa, Whitby, Courtice, Clarington, Ajax, Bowmanville, and Durham Region, Ontario

**Website** — `https://joshbyberg.com`
The hub, not a brand domain — it is the one carrying the `ProfessionalService`
schema, the contact form and the service pages. Link the brand domains from the
profile's Products/Services entries instead.

**Description** (735 chars, under the 750 limit)

> I design and build websites, print collateral and brand identity for small
> businesses and racing programs across Durham Region. Based in Oshawa, I work
> with clients in Whitby, Ajax, Courtice, Bowmanville and Clarington.
>
> The work runs from full websites in React and Next.js through WordPress and
> Shopify storefronts, to the printed pieces a business actually hands to
> people: trade show booths, brochures, promotional cards and vehicle and
> apparel graphics. I also build automation and AI tooling that removes
> repetitive work from a small team's week.
>
> Every piece is made for the place it has to work — a booth banner read from
> across a hall, a card read in a second and a half, a site that loads before a
> visitor leaves.

**Services** — add each as a service item with its own short description:
Website design · Website development · E-commerce (Shopify / WooCommerce) ·
Graphic design · Brand identity and logo design · Print and large-format design ·
Trade show graphics · Social media graphics · Workflow automation and AI
integration

**Products** — use these to point at the brand domains:
- *Whitespace Designs — design case studies* → `https://whitespacedesign.ca`
- *Race Dad — Canadian minimoto* → `https://racedad.ca`

### After it is live

- Post the case studies as GBP Posts as they publish — the profile rewards activity
- Add photos of real delivered work (the trade-show booth, the rider cards, the
  race suits). Photo volume and recency both feed prominence.
- **Reviews are the part that compounds.** Review velocity — steady recent
  reviews with fast owner responses — moves local ranking more than almost
  anything else available here. Ask every completed client, and reply to each one.

### Citations

Aim for 20–30 listings on directories that matter, with **byte-identical** NAP.
Start with: Bing Places, Apple Business Connect, Yelp Canada, Yellow Pages
Canada, Facebook, LinkedIn, and the Greater Oshawa Chamber of Commerce. Get the
format right on the first one and copy it verbatim to the rest.
