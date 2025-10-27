#!/usr/bin/env node
/**
 * Script to update test imports to use our vitest-utils polyfill
 * This replaces `from 'vitest'` with `from '@/test/vitest-utils'`
 */

import { readFileSync, writeFileSync } from 'fs';
import { glob } from 'glob';
import path from 'path';

const testFiles = await glob('src/**/*.test.{ts,tsx}', { nodir: true });

console.log(`Found ${testFiles.length} test files to process...\n`);

let totalReplacements = 0;

for (const file of testFiles) {
  let content = readFileSync(file, 'utf8');
  const originalContent = content;
  
  // Count how many times we need to replace
  const matches = (content.match(/from ['"]vitest['"]/g) || []).length;
  
  if (matches === 0) {
    continue;
  }
  
  // Replace `from 'vitest'` with `from './test/vitest-utils'` or appropriate relative path
  // Calculate relative path from current file to src/test/vitest-utils
  const fileDir = path.dirname(file);
  const targetPath = 'src/test/vitest-utils';
  const relativePath = path.relative(fileDir, targetPath).replace(/\\/g, '/');
  
  // Replace the import
  content = content.replace(
    /from ['"]vitest['"]/g,
    `from '${relativePath}'`
  );
  
  if (content !== originalContent) {
    writeFileSync(file, content, 'utf8');
    console.log(`✅ ${file}: ${matches} replacement(s) -> ${relativePath}`);
    totalReplacements += matches;
  }
}

console.log(`\n✨ Done! Updated ${totalReplacements} imports across ${testFiles.length} files.`);
