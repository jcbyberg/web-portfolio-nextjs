// ---------------------------------------------------------------------------
// Operator-set values for the Oshawa $500 promotion.
//
// EVERY value marked TODO must be replaced before this page is deployed.
// They are deliberately loud so an unfinished page is obvious on sight rather
// than shipping a fabricated deadline or an unapproved endorsement.
//
// Rules this page must not break (docs/campaign/oshawa-outreach.md, PLAN §11):
//   - No ranking or SEO-outcome language. Describe deliverables only.
//   - No guaranteed results, no numbers, no causation claims.
//   - No manufactured scarcity: OFFER_END_DATE must be a date the operator
//     actually intends to honour.
//   - Bourne To Climb usage stays inside data/permissions/bourne-to-climb.md.
// ---------------------------------------------------------------------------

// Set by the operator 2026-08-14. A real deadline he intends to honour.
//
// Two values deliberately: the display string is what visitors read, and the
// ISO instant is what the page actually compares against. Without the second,
// the page would still advertise "booked by August 31" in December.
// 2026-09-01T03:59:59Z is the end of Aug 31 in Eastern Daylight Time (UTC-4).
export const OFFER_END_DATE = 'August 31, 2026'
export const OFFER_END_ISO = '2026-09-01T03:59:59Z'

// TODO(operator): how many builds you can genuinely deliver in that window.
// Must be a real capacity limit, not a pressure tactic. null hides the count.
export const SLOTS_AVAILABLE = null

// Approval to publish Dustin Bourne's words as a quoted testimonial AND a
// screenshot of his live site.
//
// PROVENANCE. Owner approval confirmed by Josh on 2026-08-14, covering both the
// quote and the screenshot. Recorded in the permission register kept outside
// this repo at D:/moneymaker/data/permissions/bourne-to-climb.md under
// "Quoted testimonial (added 2026-08-14)".
//
// Setting this to false removes the quote and the screenshot from the page and
// falls back to an attributed, unquoted paraphrase — the wording that is safe
// without owner approval. Do that immediately if approval is ever withdrawn.
//
// Note the register still recommends storing the approval as an artifact (a
// saved text or email from Dustin) rather than a relayed confirmation.
export const BOURNE_QUOTE_APPROVED = true

// Dustin Bourne's words, as relayed by Josh 2026-08-14.
// Do not edit, trim, or embellish — a testimonial is a real person's statement.
export const BOURNE_TESTIMONIAL = 'Now I have more work than my team can do.'

// Contact details shown on the page.
export const CONTACT_EMAIL = 'info@joshbyberg.com'
// Operator decision 2026-08-14: email only. Deliberately null — no phone CTA,
// and the page must not warn about its absence.
export const CONTACT_PHONE = null

export const SERVICE_AREA = [
  'Oshawa',
  'Whitby',
  'Courtice',
  'Clarington',
  'Ajax',
  'Bowmanville',
]
