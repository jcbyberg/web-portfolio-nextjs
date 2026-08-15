// Shared FAQ source of truth. Rendered by components/FAQSection.jsx and
// mirrored as FAQPage JSON-LD in page.js — the two must stay in sync, which
// is exactly why both import from here instead of keeping their own copies.
//
// Copy rules (same as the /oshawa page, docs/campaign/oshawa-outreach.md §11):
// describe deliverables only — no ranking/SEO-outcome language, no guaranteed
// results, no numbers-as-outcomes or metrics (a stated price for a deliverable
// is fine — that is what /oshawa does), no causation claims.
export const FAQ_ITEMS = [
  {
    question: 'What types of web design projects do you specialize in?',
    answer:
      'I specialize in small-business websites, one-page marketing sites, portfolio sites, and e-commerce storefronts. Most builds use Next.js, React, and Tailwind CSS, and every project ships mobile-first with fast load times and schema.org structured data so search engines and AI assistants can read the business correctly. I also handle graphic design — logos, brand identity, and marketing materials — so the site and the brand look like one company.',
  },
  {
    question:
      'Do you offer services for businesses in Oshawa and the Durham Region?',
    answer:
      "Yes. I'm based in Oshawa, Ontario, and I work with businesses across the Durham Region, including Whitby, Courtice, Ajax, Clarington, and Bowmanville. Local projects start with a conversation about what your business does, who it serves, and what you want the site to do — then you get a written scope of work and a fixed price before anything is built.",
  },
  {
    question: 'How can your portfolio help my business?',
    answer:
      'The portfolio shows real, live projects you can visit today — including a site built for an Oshawa business — so you can judge the work before you reach out. Each project describes the problem it solved, how it was built, and what it does for the people using it. If your business needs a web presence, the same approach applies to yours: a fast, mobile-first site with clear service information and a direct path for customers to contact you.',
  },
  {
    question: 'Do you also handle graphic design and branding?',
    answer:
      'Yes. Alongside development I design logos, brand guidelines, icon sets, social media graphics, and print materials like posters, flyers, and business cards, plus product labels and packaging. When a project needs both, the site and the brand are designed together so everything matches.',
  },
  {
    question: 'How do I start a project with you?',
    answer:
      'Use the contact form below or email info@joshbyberg.com with what your business does and what you want the site to do. You\'ll get a reply with questions, a written scope of work, and a fixed price. Businesses in Oshawa and the Durham Region can also look at the flat-rate $500 one-page website package.',
  },
]
