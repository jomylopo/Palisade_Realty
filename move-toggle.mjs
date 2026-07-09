import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs';
import { join, extname, basename } from 'path';

const SKIP_DIRS = new Set(['node_modules', '.git', 'temporary screenshots', 'studio', 'brand_assets', '.vercel']);

// Toggle as it should appear INSIDE the right nav (4-space indent)
const TOGGLE_IN_NAV =
  '    <button class="lang-toggle" id="lang-toggle" aria-label="Switch language / Cambiar idioma">' +
  '<span class="lang-en lang-active">EN</span>' +
  '<span class="lang-sep">|</span>' +
  '<span class="lang-es">ES</span></button>';

// Toggle as it appears standalone (2-space indent) — to be removed from current position
const TOGGLE_STANDALONE =
  '  <button class="lang-toggle" id="lang-toggle" aria-label="Switch language / Cambiar idioma">' +
  '<span class="lang-en lang-active">EN</span>' +
  '<span class="lang-sep">|</span>' +
  '<span class="lang-es">ES</span></button>';

let updated = 0;
let skipped = 0;

function walk(dir) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    const stat = statSync(full);
    if (stat.isDirectory()) {
      if (!SKIP_DIRS.has(entry)) walk(full);
    } else if (extname(entry) === '.html') {
      if (basename(full) === 'index.html' && full.replace(/\\/g, '/').split('/').slice(-2)[0] !== 'communities') {
        // skip root index.html (already done), but process communities/index if it exists
        if (!full.includes('\\communities\\') && !full.includes('/communities/')) {
          skipped++;
          continue;
        }
      }
      processFile(full);
    }
  }
}

function processFile(filePath) {
  let content = readFileSync(filePath, 'utf8');

  // Skip if no toggle at all
  if (!content.includes('lang-toggle')) { skipped++; return; }

  // Skip if toggle is already inside nav-links--right
  const rightNavBlock = content.match(/nav-links--right[^>]*>([\s\S]*?)<\/nav>/);
  if (rightNavBlock && rightNavBlock[1].includes('lang-toggle')) { skipped++; return; }

  // Step 1: Insert toggle inside right nav, just before its closing </nav>
  // Match the right nav block (only contains <a> tags, no nested navs)
  const before = content;
  content = content.replace(
    /(<nav class="nav-links nav-links--right"[^>]*>[\s\S]*?)(  <\/nav>)/,
    `$1${TOGGLE_IN_NAV}\n  $2`
  );

  if (content === before) {
    console.warn(`  WARN: right nav pattern not found in ${filePath}`);
    skipped++;
    return;
  }

  // Step 2: Remove standalone toggle from old position (handles both LF and CRLF)
  content = content.replace(/\r?\n[ \t]*<button class="lang-toggle" id="lang-toggle"[^\n]*/, '');

  writeFileSync(filePath, content, 'utf8');
  updated++;
  console.log(`  OK: ${filePath.split(/[\\/]/).slice(-2).join('/')}`);
}

console.log('Moving lang-toggle inside nav-links--right on all pages...\n');
walk('.');
console.log(`\nDone — updated: ${updated}, skipped: ${skipped}`);
