// Image optimization script
// Converts large PNG logos to optimized WebP format
import sharp from 'sharp';
import { readdir } from 'fs/promises';
import { join } from 'path';

const publicDir = './public';

async function optimizeImages() {
  console.log('🖼️  Starting image optimization...\n');

  // Process logo_dark.png
  console.log('Processing logo_dark.png...');
  const darkPngSize = await getFileSize(join(publicDir, 'logo_dark.png'));
  console.log(`  Original: ${formatBytes(darkPngSize)}`);

  await sharp(join(publicDir, 'logo_dark.png'))
    .resize(800, null, { withoutEnlargement: true }) // Max width 800px
    .webp({ quality: 80 })
    .toFile(join(publicDir, 'logo_dark.webp'));

  const darkWebpSize = await getFileSize(join(publicDir, 'logo_dark.webp'));
  console.log(`  WebP: ${formatBytes(darkWebpSize)} (${Math.round((1 - darkWebpSize / darkPngSize) * 100)}% smaller)`);

  // Process logo_light.png
  console.log('\nProcessing logo_light.png...');
  const lightPngSize = await getFileSize(join(publicDir, 'logo_light.png'));
  console.log(`  Original: ${formatBytes(lightPngSize)}`);

  await sharp(join(publicDir, 'logo_light.png'))
    .resize(800, null, { withoutEnlargement: true }) // Max width 800px
    .webp({ quality: 80 })
    .toFile(join(publicDir, 'logo_light.webp'));

  const lightWebpSize = await getFileSize(join(publicDir, 'logo_light.webp'));
  console.log(`  WebP: ${formatBytes(lightWebpSize)} (${Math.round((1 - lightWebpSize / lightPngSize) * 100)}% smaller)`);

  // Also create optimized PNG versions (smaller dimensions)
  console.log('\nCreating optimized PNG versions...');
  
  await sharp(join(publicDir, 'logo_dark.png'))
    .resize(800, null, { withoutEnlargement: true })
    .png({ quality: 80, compressionLevel: 9 })
    .toFile(join(publicDir, 'logo_dark_optimized.png'));

  const darkOptPngSize = await getFileSize(join(publicDir, 'logo_dark_optimized.png'));
  console.log(`  logo_dark_optimized.png: ${formatBytes(darkOptPngSize)} (${Math.round((1 - darkOptPngSize / darkPngSize) * 100)}% smaller)`);

  await sharp(join(publicDir, 'logo_light.png'))
    .resize(800, null, { withoutEnlargement: true })
    .png({ quality: 80, compressionLevel: 9 })
    .toFile(join(publicDir, 'logo_light_optimized.png'));

  const lightOptPngSize = await getFileSize(join(publicDir, 'logo_light_optimized.png'));
  console.log(`  logo_light_optimized.png: ${formatBytes(lightOptPngSize)} (${Math.round((1 - lightOptPngSize / lightPngSize) * 100)}% smaller)`);

  console.log('\n✅ Image optimization complete!');
  console.log('\n📊 Summary:');
  console.log(`  Total saved: ${formatBytes((darkPngSize + lightPngSize) - (darkWebpSize + lightWebpSize))}`);
  console.log(`  Reduction: ${Math.round((1 - (darkWebpSize + lightWebpSize) / (darkPngSize + lightPngSize)) * 100)}%`);
}

async function getFileSize(filePath) {
  const fs = await import('fs/promises');
  const stats = await fs.stat(filePath);
  return stats.size;
}

function formatBytes(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}

optimizeImages().catch(console.error);
