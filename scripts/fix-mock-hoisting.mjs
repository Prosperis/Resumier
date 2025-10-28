/**
 * Fix Vitest 4.x Mock Initialization Errors
 * 
 * Issue: "Cannot access '__vi_import_X__' before initialization"
 * Cause: vi.mock() with async callbacks or importActual() calls at module scope
 * Solution: Wrap mock factories in vi.hoisted() for proper hoisting
 * 
 * Vitest 4.x requires mock factories to be hoisted explicitly when they:
 * 1. Use async/await
 * 2. Call vi.importActual()
 * 3. Reference other imports
 */

import { readFile, writeFile } from 'node:fs/promises';
import { glob } from 'glob';

async function fixMockInitialization() {
  console.log('🔍 Finding test files with vi.mock() calls...\n');
  
  const testFiles = await glob('src/**/*.test.{ts,tsx}', { 
    ignore: ['**/node_modules/**', '**/dist/**'] 
  });

  let filesFixed = 0;
  let filesSkipped = 0;
  const errors = [];

  for (const filePath of testFiles) {
    try {
      const content = await readFile(filePath, 'utf-8');
      
      // Skip if no vi.mock() calls
      if (!content.includes('vi.mock(')) {
        filesSkipped++;
        continue;
      }

      // Check if already uses vi.hoisted() or doesn't need fixing
      if (content.includes('vi.hoisted(') || !needsHoisting(content)) {
        filesSkipped++;
        continue;
      }

      console.log(`📝 Fixing: ${filePath}`);
      const fixed = fixViMocks(content);
      
      if (fixed !== content) {
        await writeFile(filePath, fixed, 'utf-8');
        filesFixed++;
        console.log(`   ✅ Fixed mock initialization\n`);
      } else {
        filesSkipped++;
        console.log(`   ⏭️  No changes needed\n`);
      }
    } catch (error) {
      errors.push({ file: filePath, error: error.message });
      console.error(`   ❌ Error: ${error.message}\n`);
    }
  }

  console.log('\n' + '='.repeat(60));
  console.log('📊 Summary:');
  console.log(`   ✅ Files fixed: ${filesFixed}`);
  console.log(`   ⏭️  Files skipped: ${filesSkipped}`);
  console.log(`   ❌ Errors: ${errors.length}`);
  console.log('='.repeat(60));

  if (errors.length > 0) {
    console.log('\n❌ Errors encountered:');
    errors.forEach(({ file, error }) => {
      console.log(`   ${file}: ${error}`);
    });
  }

  return { filesFixed, filesSkipped, errors };
}

/**
 * Check if vi.mock() calls need hoisting
 */
function needsHoisting(content) {
  // Check for async mock factories
  const asyncMockPattern = /vi\.mock\([^,]+,\s*async\s*\(/;
  
  // Check for importActual usage
  const importActualPattern = /vi\.mock\([^}]*vi\.importActual/s;
  
  // Check for await in mock factory
  const awaitInMockPattern = /vi\.mock\([^}]*await/s;
  
  return asyncMockPattern.test(content) || 
         importActualPattern.test(content) || 
         awaitInMockPattern.test(content);
}

/**
 * Fix vi.mock() calls to use vi.hoisted() when needed
 */
function fixViMocks(content) {
  // Pattern 1: async mock with importActual
  // vi.mock("module", async () => { ... })
  // becomes
  // vi.mock("module", vi.hoisted(async () => { ... }))
  
  const asyncMockPattern = /vi\.mock\(([^,]+),\s*(async\s*\([^)]*\)\s*=>\s*\{[^}]*\})\)/gs;
  
  let fixed = content.replace(asyncMockPattern, (match, moduleName, factory) => {
    // Check if this mock uses importActual or await
    if (factory.includes('importActual') || factory.includes('await')) {
      return `vi.mock(${moduleName}, vi.hoisted(${factory}))`;
    }
    return match;
  });

  // Pattern 2: async mock with arrow function that spans multiple lines
  // vi.mock("module", async () => {
  //   const actual = await vi.importActual("module")
  //   return { ...actual }
  // })
  const multilineAsyncMockPattern = /vi\.mock\(([^,]+),\s*async\s*\(([^)]*)\)\s*=>\s*\{/g;
  
  fixed = fixed.replace(multilineAsyncMockPattern, (match, moduleName, params) => {
    // Find the closing of this mock
    const mockStart = fixed.indexOf(match);
    if (mockStart === -1) return match;
    
    const afterMatch = fixed.slice(mockStart + match.length);
    const closingBrace = findClosingBrace(afterMatch);
    
    if (closingBrace === -1) return match;
    
    const fullMock = match + afterMatch.slice(0, closingBrace + 1);
    
    // Only wrap if it uses importActual or await
    if (fullMock.includes('importActual') || fullMock.includes('await')) {
      return `vi.mock(${moduleName}, vi.hoisted(async (${params}) => {`;
    }
    
    return match;
  });

  return fixed;
}

/**
 * Find the closing brace for a block
 */
function findClosingBrace(text) {
  let depth = 1;
  let inString = false;
  let stringChar = '';
  
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const prevChar = i > 0 ? text[i - 1] : '';
    
    // Handle strings
    if ((char === '"' || char === "'" || char === '`') && prevChar !== '\\') {
      if (!inString) {
        inString = true;
        stringChar = char;
      } else if (char === stringChar) {
        inString = false;
        stringChar = '';
      }
    }
    
    if (!inString) {
      if (char === '{') depth++;
      if (char === '}') depth--;
      
      if (depth === 0) {
        return i;
      }
    }
  }
  
  return -1;
}

// Run the fixer
fixMockInitialization()
  .then(({ filesFixed, errors }) => {
    if (errors.length === 0) {
      console.log('\n✨ Done! All mock initialization issues fixed.');
      console.log('\n💡 Next step: Run tests with "npm run test"');
      process.exit(0);
    } else {
      console.log('\n⚠️  Some files had errors. Please review manually.');
      process.exit(1);
    }
  })
  .catch(error => {
    console.error('\n❌ Fatal error:', error);
    process.exit(1);
  });
