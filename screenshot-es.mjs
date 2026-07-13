import puppeteer from 'puppeteer-core';
import { mkdir } from 'fs/promises';
import { existsSync } from 'fs';

const url   = process.argv[2] || 'http://localhost:3000';
const label = process.argv[3] ? `-${process.argv[3]}` : '';
const dir   = './temporary screenshots';
const exe   = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

if (!existsSync(dir)) await mkdir(dir, { recursive: true });

let n = 1;
while (existsSync(`${dir}/screenshot-${n}${label}.png`)) n++;

const browser = await puppeteer.launch({
  executablePath: exe,
  args: ['--no-sandbox', '--disable-setuid-sandbox'],
});
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });

// Load once to establish origin, then set lang=es and reload
await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
await page.evaluate(() => { localStorage.setItem('pr-lang', 'es'); });
await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
// Extra wait for fetch + applyLang to settle
await new Promise(r => setTimeout(r, 1500));

const path = `${dir}/screenshot-${n}${label}.png`;
await page.screenshot({ path, fullPage: true });
await browser.close();
console.log(`Saved: ${path}`);
