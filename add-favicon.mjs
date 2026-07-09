import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs';
import { join, relative, dirname } from 'path';

const ROOT = decodeURIComponent(new URL('.', import.meta.url).pathname.replace(/^\//, ''));

function getAllHtmlFiles(dir, files = []) {
  for (const entry of readdirSync(dir)) {
    if (entry === 'node_modules' || entry === '.firecrawl' || entry === 'studio') continue;
    const full = join(dir, entry);
    const stat = statSync(full);
    if (stat.isDirectory()) getAllHtmlFiles(full, files);
    else if (entry.endsWith('.html')) files.push(full);
  }
  return files;
}

const files = getAllHtmlFiles(ROOT);
let updated = 0;

for (const file of files) {
  let html = readFileSync(file, 'utf8');
  if (html.includes('favicon')) continue; // already has one

  // Determine depth relative to root
  const rel = relative(ROOT, dirname(file));
  const depth = rel === '' ? 0 : rel.split(/[\\/]/).length;
  const prefix = depth === 0 ? '' : '../'.repeat(depth);
  const faviconHref = `${prefix}images/favicon.jpg`;

  const tag = `<link rel="icon" type="image/jpeg" href="${faviconHref}">`;
  const replaced = html.replace(/<\/head>/, `  ${tag}\n</head>`);

  if (replaced !== html) {
    writeFileSync(file, replaced, 'utf8');
    updated++;
  }
}

console.log(`Done — updated ${updated} files.`);
