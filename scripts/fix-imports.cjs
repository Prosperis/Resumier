const fs = require('fs');
const path = require('path');

function getAllFiles(dirPath, arrayOfFiles) {
  const files = fs.readdirSync(dirPath);

  arrayOfFiles = arrayOfFiles || [];

  files.forEach(file => {
    const filePath = path.join(dirPath, file);
    if (fs.statSync(filePath).isDirectory()) {
      arrayOfFiles = getAllFiles(filePath, arrayOfFiles);
    } else if (file.endsWith('.test.ts') || file.endsWith('.test.tsx')) {
      arrayOfFiles.push(filePath);
    }
  });

  return arrayOfFiles;
}

function fixImports(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  const original = content;
  
  // Pattern: import { ... } from "vitest"
  // We want to keep only vi, remove describe, it, expect, beforeEach, afterEach, beforeAll, afterAll
  content = content.replace(/import\s*\{([^}]+)\}\s*from\s*["']vitest["']/g, (match, imports) => {
    // Check if 'vi' is in the imports
    const hasVi = /\bvi\b/.test(imports);
    
    if (hasVi) {
      return 'import { vi } from "vitest"';
    } else {
      // No vi, remove the entire import line
      return '';
    }
  });
  
  // Remove empty lines created by removing imports
  content = content.replace(/^\s*\n/gm, '');
  
  if (content !== original) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Fixed: ${filePath}`);
    return true;
  }
  return false;
}

const srcDir = path.join(__dirname, 'src');
const testFiles = getAllFiles(srcDir);
let fixed = 0;

testFiles.forEach(file => {
  if (fixImports(file)) {
    fixed++;
  }
});

console.log(`\nDone! Fixed ${fixed} of ${testFiles.length} test files.`);
