# Task: Portfolio SEO & AI Search Optimization

The goal is to update this Next.js portfolio site (`D:\Projects\web-portfolio-nextjs`) to improve local SEO (for Oshawa/Durham Region) and prepare it for AI Search engines (GEO).

Please implement the following changes in the React components/pages:

1. **Schema Update:** Update the JSON-LD structured data in the site's layout or page components. Change it from a basic `Person` schema to a `ProfessionalService` schema. Include properties for service area (Oshawa, Durham Region) and add `sameAs` links to `https://github.com/jcbyberg` and LinkedIn. Also, add `FAQPage` schema corresponding to the FAQ section you will build.

2. **Content Restructure (Answer-First & Local Focus):**
   - Update the "About Me" and "Projects" sections to have an "Answer-First" structure. (e.g., use an H2 like "What I do for my clients" followed by a concise 2-4 sentence summary).
   - Inject hyper-local content into the copy, specifically mentioning "Oshawa" and "Durham Region" to build local authority.
   - Expand the descriptions of the projects (Bourne To Climb, Guitar Vault, etc.) to include textual details of the problem solved, technologies used, and the impact (so AI engines have context to extract).

3. **Add an FAQ Section:** Create an FAQ section (with matching FAQ JSON-LD schema) that answers common client questions, such as:
   - What types of web design projects do you specialize in?
   - Do you offer services for businesses in Oshawa and the Durham Region?
   - How can your portfolio help my business?

Make sure to preserve the existing styling (Tailwind CSS) and site structure. Run the development server or build if you need to verify it works, but DO NOT commit the changes—just leave them in the working tree for me to review.

Write the files first as a skeleton, re-write after each section, never batch to the end, read back before finishing.
