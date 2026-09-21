#!/usr/bin/env node
// Batch fix all malformed whitespace drafts

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const REPO_ROOT = path.resolve(__dirname);

const draftsDir = path.join(REPO_ROOT, 'drafts', 'whitespace');
const files = fs
  .readdirSync(draftsDir)
  .filter((f) => f.endsWith('.md'))
  .sort();

// Files that are already fixed (or don't need fixes based on prior edits)
const ALREADY_FIXED = [
  'Dynamic-Favicons.md',
  'Endless-Kinetic-Marquees.md', // Fixed manually
  'Freeform-Canvas-UIs.md',
  'Gamification-UX.md',
  'Interactive-WebGL-Three-js-Heroes.md',
  'Mixed-Typographic-Pairs.md', // Fixed manually
  'Outlined-Stroke-Only-Text.md',
  'Pixel-Art-8-Bit-Accents.md',
  'art-deco-web.md',
  'aurora-mesh-gradients.md',
  'bento-box-layouts.md',
  'ethereal-aesthetics-soft-ui.md',
  'glassmorphism-ui.md',
  'glassmorphism.md',
  'grain-and-noise-textures.md',
  'holographic-iridescent-ui.md',
  'holographic-iridescent.md',
  'isometric-3d.md',
  'memphis-design.md',
  'monochrome-dominance.md',
  'native-page-transitions.md',
  'overlapping-layers-z-axis.md',
  'pixel-art-8-bit.md',
  'rich-media-mega-menus.md',
  'scrollytelling-interactive-narrative.md',
  'soft-ui-pastel.md',
  'split-screen-layouts.md',
];

const NEEDS_FIXING = files.filter(f => !ALREADY_FIXED.includes(f));

console.log(`Found ${NEEDS_FIXING.length} files still needing fixes.\n`);

function generateMetadata(filename) {
  // Extract a title from the filename
  const titleFromFilename = filename
    .replace(/\.md$/, '')
    .replace(/^draft-/, '')
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  return {
    collection: 'whitespace',
    type: 'essay',
    title: titleFromFilename,
    excerpt: `Exploring the ${titleFromFilename.toLowerCase()} design trend and how it impacts modern web experiences.`,
    tags: 'design, ui, trend, css, ux',
  };
}

function ensureMetadataBlock(content, filename) {
  // Check if metadata block already exists
  if (content.includes('- **Collection:** whitespace')) {
    return content; // Already has metadata
  }

  const metadata = generateMetadata(filename);

  // Create the metadata block
  const metadataBlock = `# Draft: ${metadata.title}

## 1. Post metadata and strategy

- **Collection:** ${metadata.collection}
- **Type:** ${metadata.type}
- **Title:** ${metadata.title}
- **Excerpt:** ${metadata.excerpt}
- **Tags:** ${metadata.tags}

Strategy:
- **Target Audience:** Design-forward teams, product managers, and frontend developers.
- **Goal:** Establish Whitespace as the authority on cutting-edge web design trends.

`;

  // Remove old section headers if they exist and replace with new format
  let newContent = content
    .replace(/^## 1\.\s*Post\s*(?:Metadata|metadata)\s*&?\s*Strategy/m, '')
    .replace(/^## 2\.\s*Image\s*Ideas/m, '## 2. Image ideas')
    .replace(/^## 3\.\s*Blog\s*(?:Body|body):\s*Wording\s*Options/m, '## 3. Blog body: wording options')
    .replace(/^## 4\.\s*Facebook\s*(?:Cross-Post\s*Ideas|hooks)/m, '## 4. Facebook hooks')
    .trim();

  return metadataBlock + '\n' + newContent;
}

function ensureSectionHeaders(content) {
  // Normalize section headers to match the expected format
  content = content.replace(/## 2\.\s*Image\s*Ideas/i, '## 2. Image ideas');
  content = content.replace(
    /## 3\.\s*Blog\s*(?:Body|body):\s*Wording\s*Options/i,
    '## 3. Blog body: wording options'
  );
  content = content.replace(/## 4\.\s*Facebook\s*(?:Cross-Post\s*Ideas|hooks)/i, '## 4. Facebook hooks');

  // Normalize Facebook hooks format
  content = content.replace(/\*\*Option A\s*\(.*?\)\*\*:\s*/g, '- **Hook A (for Option A):** ');
  content = content.replace(/\*\*Option B\s*\(.*?\)\*\*:\s*/g, '- **Hook B (for Option B):** ');
  content = content.replace(/\[Link in comments\]/g, '(Assumes link in body)');

  return content;
}

// Process each file
NEEDS_FIXING.forEach((filename) => {
  const filePath = path.join(draftsDir, filename);
  let content = fs.readFileSync(filePath, 'utf8');

  // Step 1: Ensure metadata block
  content = ensureMetadataBlock(content, filename);

  // Step 2: Ensure section headers
  content = ensureSectionHeaders(content);

  // Write back
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`✓ Fixed ${filename}`);
});

console.log(`\n✅ All ${NEEDS_FIXING.length} files have been fixed!`);
