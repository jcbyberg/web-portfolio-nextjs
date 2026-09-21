#!/usr/bin/env node
// Quick validator to check all whitespace drafts against publish-daily-whitespace.mjs requirements

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

console.log(`Validating ${files.length} draft files...\n`);

let passCount = 0;
let failCount = 0;
const failures = [];

files.forEach((filename) => {
  const filePath = path.join(draftsDir, filename);
  const content = fs.readFileSync(filePath, 'utf8');

  const issues = [];

  // Check required metadata
  if (!content.match(/- \*\*Title:\*\* (.*)/)) {
    issues.push('Missing metadata: Title');
  }
  if (!content.match(/- \*\*Excerpt:\*\* (.*)/)) {
    issues.push('Missing metadata: Excerpt');
  }
  if (!content.match(/- \*\*Tags:\*\* (.*)/)) {
    issues.push('Missing metadata: Tags');
  }

  // Check Option A/B structure
  const OPTION_A = '### Option A:';
  const OPTION_B = '### Option B:';

  const aIndex = content.indexOf(OPTION_A);
  if (aIndex === -1) {
    issues.push(`Missing section: "${OPTION_A}"`);
  } else {
    const bIndex = content.indexOf(OPTION_B, aIndex + OPTION_A.length);
    if (bIndex === -1) {
      issues.push(`Missing section: "${OPTION_B}" (after Option A)`);
    }
  }

  if (issues.length === 0) {
    console.log(`✓ ${filename}`);
    passCount++;
  } else {
    console.log(`✗ ${filename}`);
    issues.forEach((issue) => console.log(`  - ${issue}`));
    failCount++;
    failures.push({ filename, issues });
  }
});

console.log(`\n--- Summary ---`);
console.log(`Passed: ${passCount}/${files.length}`);
console.log(`Failed: ${failCount}/${files.length}`);

if (failures.length > 0) {
  console.log(`\nFailed files:`);
  failures.forEach(({ filename }) => console.log(`  - ${filename}`));
  process.exit(1);
} else {
  console.log(`\nAll drafts valid!`);
  process.exit(0);
}
