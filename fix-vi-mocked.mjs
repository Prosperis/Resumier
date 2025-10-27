#!/usr/bin/env node
/**
 * Script to replace vi.mocked() calls with direct casts
 * This fixes compatibility with Vitest 1.4.0 which doesn't have vi.mocked()
 */

import { readFileSync, writeFileSync } from 'fs';
import { glob } from 'glob';

const testFiles = await glob('src/**/*.test.{ts,tsx}', { nodir: true });

console.log(`Found ${testFiles.length} test files to process...\n`);

let totalReplacements = 0;

for (const file of testFiles) {
  let content = readFileSync(file, 'utf8');
  const originalContent = content;
  
  // Replace vi.mocked(something) with (something as any)
  // Use a more specific regex that only matches vi.mocked calls
  const regex = /\bvi\.mocked\(([^)]+)\)/g;
  let matches = 0;
  
  content = content.replace(regex, (match, captured) => {
    matches++;
    return `(${captured} as any)`;
  });
  
  if (matches > 0) {
    writeFileSync(file, content, 'utf8');
    console.log(`✅ ${file}: ${matches} replacement(s)`);
    totalReplacements += matches;
  }
}

console.log(`\n✨ Done! Replaced ${totalReplacements} vi.mocked() calls across ${testFiles.length} files.`);
