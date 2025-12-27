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

  // Replace /paint.png with /PortFolio/paint.png
  if (content.includes('/paint.png')) {
    content = content.replace(/\/paint\.png/g, `${baseHref}/paint.png`);
    modified = true;
  }

  if (modified) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✓ Fixed paths in: ${path.basename(filePath)}`);
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
