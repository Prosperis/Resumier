/**
 * Update tests that use vi.clearAllMocks() to import vi from vitest-utils
 */

import { readFile, writeFile } from 'node:fs/promises';
import { glob } from 'glob';

async function updateClearAllMocksImports() {
  console.log('🔍 Finding test files that use vi.clearAllMocks()...\n');
  
  const testFiles = await glob('src/**/*.test.{ts,tsx}', { 
    ignore: ['**/node_modules/**', '**/dist/**'] 
  });

  let filesUpdated = 0;
  let filesSkipped = 0;

  for (const filePath of testFiles) {
    try {
      const content = await readFile(filePath, 'utf-8');
      
      // Skip if doesn't use vi.clearAllMocks()
      if (!content.includes('vi.clearAllMocks()')) {
        filesSkipped++;
        continue;
      }

      // Skip if already imports from vitest-utils
      if (content.match(/import\s+.*\bvi\b.*from\s+['"].*vitest-utils['"]/)) {
        filesSkipped++;
        continue;
      }

      console.log(`📝 Updating: ${filePath}`);
      
      let updated = content;
      
      // Calculate relative path to vitest-utils
      const depth = filePath.split('/').length - 2; // -2 for src/ and file itself
      const relativePath = '../'.repeat(depth) + 'test/vitest-utils';
      
      // Pattern 1: import { ..., vi, ... } from 'vitest'
      // Replace with two imports: vitest for other stuff, vitest-utils for vi
      const vitestImportPattern = /import\s+\{([^}]+)\}\s+from\s+['"]vitest['"]/g;
      const match = vitestImportPattern.exec(content);
      
      if (match) {
        const imports = match[1].split(',').map(s => s.trim());
        const viIndex = imports.indexOf('vi');
        
        if (viIndex !== -1) {
          // Remove vi from the list
          const otherImports = imports.filter(i => i !== 'vi');
          
          if (otherImports.length > 0) {
            // Keep vitest import for other items, add vitest-utils import for vi
            updated = updated.replace(
              match[0],
              `import { ${otherImports.join(', ')} } from 'vitest'\nimport { vi } from '${relativePath}'`
            );
          } else {
            // Only vi was imported, replace entirely
            updated = updated.replace(
              match[0],
              `import { vi } from '${relativePath}'`
            );
          }
          
          filesUpdated++;
          console.log(`   ✅ Updated vi import to use vitest-utils\n`);
          await writeFile(filePath, updated, 'utf-8');
        } else {
          filesSkipped++;
        }
      } else {
        filesSkipped++;
      }
    } catch (error) {
      console.error(`   ❌ Error in ${filePath}: ${error.message}\n`);
    }
  }

  console.log('\n' + '='.repeat(60));
  console.log('📊 Summary:');
  console.log(`   ✅ Files updated: ${filesUpdated}`);
  console.log(`   ⏭️  Files skipped: ${filesSkipped}`);
  console.log('='.repeat(60));
  console.log('\n✨ Done! Files now import vi from vitest-utils');
  console.log('\n💡 Next: Run "npm run test" to verify tests pass');
}

updateClearAllMocksImports().catch(console.error);
