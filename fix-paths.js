const fs = require('fs');
const path = require('path');

const distDir = path.join(__dirname, 'dist', 'portfolio-angular', 'browser');
const baseHref = '/PortFolio';

function fixPaths(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;

  // Replace /assets/ with /PortFolio/assets/
  if (content.includes('/assets/')) {
    content = content.replace(/\/assets\//g, `${baseHref}/assets/`);
    modified = true;
  }

  // Replace /paint.jpg with /PortFolio/paint.jpg
  if (content.includes('/paint.jpg')) {
    content = content.replace(/\/paint\.jpg/g, `${baseHref}/paint.jpg`);
    modified = true;
  }

  // Replace /paint.webp with /PortFolio/paint.webp
  if (content.includes('/paint.webp')) {
    content = content.replace(/\/paint\.webp/g, `${baseHref}/paint.webp`);
    modified = true;
  }

  // Replace /og-image.jpg with /PortFolio/og-image.jpg
  if (content.includes('/og-image.jpg')) {
    content = content.replace(/\/og-image\.jpg/g, `${baseHref}/og-image.jpg`);
    modified = true;
  }

  // Replace /og-image.webp with /PortFolio/og-image.webp
  if (content.includes('/og-image.webp')) {
    content = content.replace(/\/og-image\.webp/g, `${baseHref}/og-image.webp`);
    modified = true;
  }

  // Replace /star.png with /PortFolio/star.png
  if (content.includes('/star.png')) {
    content = content.replace(/\/star\.png/g, `${baseHref}/star.png`);
    modified = true;
  }

  if (modified) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✓ Fixed paths in: ${path.basename(filePath)}`);
  }
}

// Fix index.html favicon and logo paths
const indexPath = path.join(distDir, 'index.html');
if (fs.existsSync(indexPath)) {
  let indexContent = fs.readFileSync(indexPath, 'utf8');
  let indexModified = false;

  // Fix favicon.svg, favicon.ico, and logo.png paths
  if (indexContent.includes('href="favicon.svg"') || indexContent.includes('href="favicon.ico"')) {
    indexContent = indexContent.replace(/href="favicon\.(svg|ico)"/g, `href="${baseHref}/favicon.$1"`);
    indexModified = true;
  }
  if (indexContent.includes('href="logo.png"')) {
    indexContent = indexContent.replace(/href="logo\.png"/g, `href="${baseHref}/logo.png"`);
    indexModified = true;
  }

  // Fix preload image paths
  if (indexContent.includes('href="/paint.webp"')) {
    indexContent = indexContent.replace(/href="\/paint\.webp"/g, `href="${baseHref}/paint.webp"`);
    indexModified = true;
  }
  if (indexContent.includes('href="/paint.jpg"')) {
    indexContent = indexContent.replace(/href="\/paint\.jpg"/g, `href="${baseHref}/paint.jpg"`);
    indexModified = true;
  }

  if (indexModified) {
    fs.writeFileSync(indexPath, indexContent, 'utf8');
    console.log('✓ Fixed paths in: index.html');
  }
}

// Find all CSS and JS files
const files = fs.readdirSync(distDir);
for (const file of files) {
  if (file.endsWith('.css') || file.endsWith('.js')) {
    fixPaths(path.join(distDir, file));
  }
}

console.log('\nPath fixing complete!');
