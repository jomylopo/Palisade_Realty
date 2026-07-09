import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs';
import { join, extname, basename } from 'path';

const SKIP = new Set(['node_modules','.git','temporary screenshots','studio','brand_assets','.vercel']);

// Toggle as it should appear inside the right nav (4-space indent)
const TOGGLE =
  '    <button class="lang-toggle" id="lang-toggle" aria-label="Switch language / Cambiar idioma">' +
  '<span class="lang-en lang-active">EN</span>' +
  '<span class="lang-sep">|</span>' +
  '<span class="lang-es">ES</span></button>';

let updated = 0, skipped = 0;

function walk(dir) {
  for (const entry of readdirSync(dir)) {
    if (SKIP.has(entry)) continue;
    const full = join(dir, entry);
    const stat = statSync(full);
    if (stat.isDirectory()) walk(full);
    else if (extname(entry) === '.html') processFile(full);
  }
}

function isAlreadyInNav(content) {
  // Find the right nav block: from its opening to its FIRST </nav>
  const openIdx = content.indexOf('nav-links--right');
  if (openIdx === -1) return false;
  const navTagStart = content.lastIndexOf('<nav', openIdx);
  const navCloseIdx = content.indexOf('</nav>', navTagStart);
  if (navCloseIdx === -1) return false;
  const navBlock = content.slice(navTagStart, navCloseIdx + 6);
  return navBlock.includes('lang-toggle');
}

function processFile(filePath) {
  if (basename(filePath) === 'index.html' &&
      !filePath.replace(/\\/g, '/').includes('/communities/')) {
    skipped++; return;
  }

  let content = readFileSync(filePath, 'utf8');
  if (!content.includes('lang-toggle')) { skipped++; return; }
  if (isAlreadyInNav(content)) { skipped++; return; }

  // Find the right nav's opening and first </nav>
  const openIdx = content.indexOf('nav-links--right');
  const navTagStart = content.lastIndexOf('<nav', openIdx);
  const navCloseIdx = content.indexOf('</nav>', navTagStart);

  if (navCloseIdx === -1) {
    console.warn('WARN: no </nav> found after right nav in', filePath);
    skipped++; return;
  }

  // Insert toggle just before </nav>, preserving whatever whitespace is on that line
  const before = content.slice(0, navCloseIdx);
  const after  = content.slice(navCloseIdx);
  content = before + '\n' + TOGGLE + '\n' + after;

  // Remove the standalone toggle: it appears just before <button class="nav-hamburger"
  // Use a lookahead so we only remove the right one
  const standaloneRe = /\n[ \t]*<button class="lang-toggle" id="lang-toggle"[^\n]*(?=\n[ \t]*<button class="nav-hamburger")/;
  const afterRemoval = content.replace(standaloneRe, '');

  if (afterRemoval === content) {
    // Standalone not found — maybe already removed, just write with insertion
    console.warn('WARN: standalone toggle not found in', filePath);
  }
  content = afterRemoval;

  writeFileSync(filePath, content, 'utf8');
  updated++;
  console.log('OK:', filePath.split(/[/\\]/).slice(-2).join('/'));
}

console.log('Moving lang-toggle into nav-links--right on all remaining pages...\n');
walk('.');
console.log(`\nDone — updated: ${updated}, skipped: ${skipped}`);
