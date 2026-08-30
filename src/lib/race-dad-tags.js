// The race-dad tag hubs worth rebuilding as real pages. racedad.ca carries 68
// tag archives, but 46 of them held a single post each — thin content — so only
// these ten reach-y tags get rebuilt here. The worker 301s every other
// /tags/<slug> to the nearest rebuilt page. This list is the single source of
// truth: generateStaticParams derives from it, and any tag value outside it is
// a 404.

export const RACEDAD_TAGS = [
  {
    slug: 'minisbk',
    label: 'MiniSBK',
    description: 'The MiniSBK series — small bikes, real racing.',
  },
  {
    slug: 'motomini',
    label: 'MotoMini',
    description:
      'The FIM MotoMini Canada national minimoto road-racing series.',
  },
  {
    slug: 'shannonville',
    label: 'Shannonville',
    description: 'Race reports and track guides from Shannonville Motorsport Park.',
  },
  {
    slug: 'ohvale',
    label: 'Ohvale',
    description: 'The Ohvale mini road racers — setup, care and the classes they race.',
  },
  {
    slug: 'fim',
    label: 'FIM',
    description: 'FIM-sanctioned competition and the path toward the World Finals.',
  },
  {
    slug: 'ssrs',
    label: 'SSRS',
    description: 'The Super Sonic Road Race School — cones, drills and coached practice.',
  },
  {
    slug: 'race-report',
    label: 'Race Report',
    description: 'Race weekend write-ups — the grid, the podiums and everything in between.',
  },
  {
    slug: 'minimoto',
    label: 'Minimoto',
    description: 'The wider minimoto scene — the bikes, the culture and the people.',
  },
  {
    slug: 'mechanic',
    label: 'Mechanic',
    description: 'Wrenching and pit-lane mechanical work.',
  },
  {
    slug: '190cc',
    label: '190cc',
    description: 'The Ohvale 190 class — and the step up from 160.',
  },
]

// 'Race Report' -> 'race-report', 'MiniSBK' -> 'minisbk'. Posts store their
// tags display-cased, so the tag hub reconciles them against the kebab-case
// slugs in RACEDAD_TAGS by normalizing both sides.
export function tagToSlug(tag) {
  return tag.trim().toLowerCase().replace(/\s+/g, '-')
}