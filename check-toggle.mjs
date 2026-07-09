import { readFileSync, readdirSync, statSync } from 'fs';
import { join, extname } from 'path';

const SKIP = new Set(['node_modules','.git','temporary screenshots','studio','brand_assets','.vercel']);

function walk(dir, results = []) {
  for (const entry of readdirSync(dir)) {
    if (SKIP.has(entry)) continue;
    const full = join(dir, entry);
    const stat = statSync(full);
    if (stat.isDirectory()) walk(full, results);
    else if (extname(entry) === '.html') results.push(full);
  }
  return results;
}

let inNav = 0, standalone = 0;
const bad = [];

for (const f of walk('.')) {
  const c = readFileSync(f, 'utf8');
  if (!c.includes('lang-toggle')) continue;

  // Extract the right nav block: from nav-links--right opening to its first </nav>
  const rightNavOpen = c.indexOf('nav-links--right');
  if (rightNavOpen === -1) continue;
  const navStart = c.lastIndexOf('<nav', rightNavOpen);
  const navEnd = c.indexOf('</nav>', navStart);
  const navBlock = navEnd > navStart ? c.slice(navStart, navEnd + 6) : '';

  if (navBlock.includes('lang-toggle')) {
    inNav++;
  } else {
    standalone++;
    bad.push(f.split(/[/\\]/).slice(-2).join('/'));
  }
}

console.log('Inside nav:', inNav);
console.log('Still standalone:', standalone);
if (bad.length) console.log('\nFiles needing fix:\n' + bad.join('\n'));
