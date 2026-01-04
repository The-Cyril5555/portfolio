const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

async function optimizeImages() {
  console.log('🖼️  Starting image optimization...\n');

  // 1. Optimize og-image.png (3798x1825 → 1200x630, 6.2MB → ~200KB)
  console.log('📸 Optimizing og-image.png...');
  await sharp('public/og-image.png')
    .resize(1200, 630, { fit: 'cover', position: 'center' })
    .jpeg({ quality: 85, progressive: true })
    .toFile('public/og-image-optimized.jpg');

  // Create WebP version
  await sharp('public/og-image.png')
    .resize(1200, 630, { fit: 'cover', position: 'center' })
    .webp({ quality: 85 })
    .toFile('public/og-image.webp');

  const ogOriginalSize = fs.statSync('public/og-image.png').size;
  const ogOptimizedSize = fs.statSync('public/og-image-optimized.jpg').size;
  const ogWebpSize = fs.statSync('public/og-image.webp').size;
  console.log(`  ✅ Original: ${(ogOriginalSize / 1024 / 1024).toFixed(2)}MB`);
  console.log(`  ✅ JPEG: ${(ogOptimizedSize / 1024).toFixed(0)}KB (${((1 - ogOptimizedSize / ogOriginalSize) * 100).toFixed(1)}% reduction)`);
  console.log(`  ✅ WebP: ${(ogWebpSize / 1024).toFixed(0)}KB (${((1 - ogWebpSize / ogOriginalSize) * 100).toFixed(1)}% reduction)\n`);

  // 2. Optimize paint.png (2.9MB → ~400KB)
  console.log('🎨 Optimizing paint.png...');
  const paintMeta = await sharp('public/paint.png').metadata();

  await sharp('public/paint.png')
    .jpeg({ quality: 82, progressive: true })
    .toFile('public/paint-optimized.jpg');

  await sharp('public/paint.png')
    .webp({ quality: 82 })
    .toFile('public/paint.webp');

  const paintOriginalSize = fs.statSync('public/paint.png').size;
  const paintOptimizedSize = fs.statSync('public/paint-optimized.jpg').size;
  const paintWebpSize = fs.statSync('public/paint.webp').size;
  console.log(`  ✅ Original: ${(paintOriginalSize / 1024 / 1024).toFixed(2)}MB (${paintMeta.width}x${paintMeta.height})`);
  console.log(`  ✅ JPEG: ${(paintOptimizedSize / 1024).toFixed(0)}KB (${((1 - paintOptimizedSize / paintOriginalSize) * 100).toFixed(1)}% reduction)`);
  console.log(`  ✅ WebP: ${(paintWebpSize / 1024).toFixed(0)}KB (${((1 - paintWebpSize / paintOriginalSize) * 100).toFixed(1)}% reduction)\n`);

  // 3. Optimize painting images
  console.log('🖼️  Optimizing painting images...');
  const paintingsDir = 'public/assets/images/paintings';
  const paintings = fs.readdirSync(paintingsDir).filter(f => f.endsWith('.jpg'));

  let totalOriginal = 0;
  let totalOptimized = 0;
  let totalWebp = 0;

  for (const painting of paintings) {
    const inputPath = path.join(paintingsDir, painting);
    const outputPath = path.join(paintingsDir, painting.replace('.jpg', '-optimized.jpg'));
    const webpPath = path.join(paintingsDir, painting.replace('.jpg', '.webp'));

    // Get original size
    const originalSize = fs.statSync(inputPath).size;
    totalOriginal += originalSize;

    // Optimize JPEG (target ~250KB, quality 80)
    await sharp(inputPath)
      .jpeg({ quality: 80, progressive: true })
      .toFile(outputPath);

    // Create WebP version
    await sharp(inputPath)
      .webp({ quality: 80 })
      .toFile(webpPath);

    const optimizedSize = fs.statSync(outputPath).size;
    const webpSize = fs.statSync(webpPath).size;
    totalOptimized += optimizedSize;
    totalWebp += webpSize;

    console.log(`  📄 ${painting}`);
    console.log(`     Original: ${(originalSize / 1024).toFixed(0)}KB → JPEG: ${(optimizedSize / 1024).toFixed(0)}KB → WebP: ${(webpSize / 1024).toFixed(0)}KB`);
  }

  console.log(`\n  ✅ Total paintings reduction:`);
  console.log(`     Original: ${(totalOriginal / 1024 / 1024).toFixed(2)}MB`);
  console.log(`     JPEG: ${(totalOptimized / 1024 / 1024).toFixed(2)}MB (${((1 - totalOptimized / totalOriginal) * 100).toFixed(1)}% reduction)`);
  console.log(`     WebP: ${(totalWebp / 1024 / 1024).toFixed(2)}MB (${((1 - totalWebp / totalOriginal) * 100).toFixed(1)}% reduction)`);

  // Summary
  const grandTotalOriginal = ogOriginalSize + paintOriginalSize + totalOriginal;
  const grandTotalOptimized = ogOptimizedSize + paintOptimizedSize + totalOptimized;
  const grandTotalWebp = ogWebpSize + paintWebpSize + totalWebp;

  console.log('\n' + '='.repeat(60));
  console.log('📊 TOTAL OPTIMIZATION SUMMARY');
  console.log('='.repeat(60));
  console.log(`Original total: ${(grandTotalOriginal / 1024 / 1024).toFixed(2)}MB`);
  console.log(`JPEG total: ${(grandTotalOptimized / 1024 / 1024).toFixed(2)}MB (${((1 - grandTotalOptimized / grandTotalOriginal) * 100).toFixed(1)}% reduction)`);
  console.log(`WebP total: ${(grandTotalWebp / 1024 / 1024).toFixed(2)}MB (${((1 - grandTotalWebp / grandTotalOriginal) * 100).toFixed(1)}% reduction)`);
  console.log('='.repeat(60));

  console.log('\n✅ Image optimization complete!');
  console.log('\n📝 Next steps:');
  console.log('1. Review optimized images visually');
  console.log('2. Replace original files with optimized versions if satisfied');
  console.log('3. Update code to use WebP with JPEG fallback');
}

optimizeImages().catch(console.error);
