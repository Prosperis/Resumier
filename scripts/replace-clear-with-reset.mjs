import { readFileSync, writeFileSync } from 'fs'
import { glob } from 'glob'

const files = await glob('src/**/*.test.tsx')

let replacedCount = 0

for (const file of files) {
  const content = readFileSync(file, 'utf-8')
  const newContent = content.replace(/vi\.clearAllMocks\(\)/g, 'vi.resetAllMocks()')
  
  if (content !== newContent) {
    writeFileSync(file, newContent, 'utf-8')
    replacedCount++
  }
}

console.log(`✅ Replaced vi.clearAllMocks() with vi.resetAllMocks() in ${replacedCount} files`)
