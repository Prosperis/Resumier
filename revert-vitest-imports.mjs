/**
 * Revert Vitest Import Changes
 * 
 * The previous script (fix-vitest-imports.mjs) changed all imports from 'vitest'
 * to relative paths like '../../../../test/vitest-utils'. This broke mock hoisting.
 * 
 * Solution: Only import vi from vitest-utils when using vi.mocked().
 * All other imports (describe, it, expect, vi, beforeEach, etc.) should come from 'vitest'.
 */

import { readFile, writeFile } from 'node:fs/promises';
import { glob } from 'glob';

async function revertVitestImports() {
  console.log('🔄 Reverting vitest import changes...\n');
  
  const testFiles = await glob('src/**/*.test.{ts,tsx}', { 
    ignore: ['**/node_modules/**', '**/dist/**'] 
  });

  let filesReverted = 0;
  let filesSkipped = 0;

  for (const filePath of testFiles) {
    try {
      const content = await readFile(filePath, 'utf-8');
      
      // Check if this file imports from vitest-utils
      const vitestUtilsImportPattern = /from\s+['"]\.\.\/.*\/test\/vitest-utils['"]/g;
      
      if (!vitestUtilsImportPattern.test(content)) {
        filesSkipped++;
        continue;
      }

      console.log(`📝 Reverting: ${filePath}`);
      
      // Revert the import back to 'vitest'
      const reverted = content.replace(
        /import\s+\{([^}]+)\}\s+from\s+['"]\.\.\/.*\/test\/vitest-utils['"]/g,
        "import {$1} from 'vitest'"
      );
      
      if (reverted !== content) {
        await writeFile(filePath, reverted, 'utf-8');
        filesReverted++;
        console.log(`   ✅ Reverted to import from 'vitest'\n`);
      } else {
        filesSkipped++;
      }
    } catch (error) {
      console.error(`   ❌ Error in ${filePath}: ${error.message}\n`);
    }
  }

  console.log('\n' + '='.repeat(60));
  console.log('📊 Summary:');
  console.log(`   ✅ Files reverted: ${filesReverted}`);
  console.log(`   ⏭️  Files skipped: ${filesSkipped}`);
  console.log('='.repeat(60));
  console.log('\n✨ Done! All imports reverted to "vitest"');
  console.log('\n💡 Next: Run "npm run test" to verify all tests pass');
}

revertVitestImports().catch(console.error);
