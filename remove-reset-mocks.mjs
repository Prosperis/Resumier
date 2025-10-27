import { readFileSync, writeFileSync } from 'fs'
import { glob } from 'glob'

const files = await glob('src/**/*.test.tsx')

let replacedCount = 0

for (const file of files) {
  let content = readFileSync(file, 'utf-8')
  const originalContent = content
  
  // Remove vi.resetAllMocks() calls in beforeEach
  content = content.replace(/^\s*vi\.resetAllMocks\(\)\s*$/gm, '    // Mock reset handled by vitest config (clearMocks: true)')
  
  if (content !== originalContent) {
    writeFileSync(file, content, 'utf-8')
    replacedCount++
  }
}

console.log(`✅ Removed vi.resetAllMocks() from ${replacedCount} files (config handles this)`)
