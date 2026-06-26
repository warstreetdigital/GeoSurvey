import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distDir = path.join(__dirname, 'dist');

console.log('[Static Build] Preparing dist directory...');

if (fs.existsSync(distDir)) {
  fs.rmSync(distDir, { recursive: true, force: true });
}
fs.mkdirSync(distDir, { recursive: true });

const STATIC_FILES = ['index.html', 'css', 'js', 'assets'];

for (const item of STATIC_FILES) {
  const srcPath = path.join(__dirname, item);
  const destPath = path.join(distDir, item);

  if (fs.existsSync(srcPath)) {
    const stat = fs.statSync(srcPath);
    if (stat.isDirectory()) {
      fs.cpSync(srcPath, destPath, { recursive: true });
      console.log(`Copied directory: ${item}/ -> dist/${item}/`);
    } else {
      fs.copyFileSync(srcPath, destPath);
      console.log(`Copied file: ${item} -> dist/${item}`);
    }
  } else {
    console.warn(`Optional static item not found: ${item}`);
  }
}

console.log('[Static Build] Completed successfully! Strictly static files packaged.');
