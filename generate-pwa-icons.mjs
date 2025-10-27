import sharp from "sharp"
import { readFileSync, writeFileSync } from "fs"
import { join } from "path"

/**
 * Generate PWA icons from optimized logos
 * Creates 192x192 and 512x512 PNG icons for Progressive Web App
 */

const sizes = [192, 512]
const sourceImage = "public/logo_light_optimized.png" // Use light logo for icon

console.log("🎨 Generating PWA icons...")
console.log(`📁 Source: ${sourceImage}\n`)

async function generateIcons() {
  for (const size of sizes) {
    const outputFile = `public/pwa-${size}x${size}.png`

    try {
      await sharp(sourceImage)
        .resize(size, size, {
          fit: "contain",
          background: { r: 255, g: 255, b: 255, alpha: 1 }, // White background
        })
        .png({ quality: 90, compressionLevel: 9 })
        .toFile(outputFile)

      const stats = await sharp(outputFile).metadata()
      console.log(
        `✅ Created ${outputFile} - ${stats.width}x${stats.height}px`,
      )
    } catch (error) {
      console.error(`❌ Error creating ${size}x${size} icon:`, error.message)
    }
  }

  console.log("\n✨ PWA icons generated successfully!")
}

generateIcons().catch(console.error)
