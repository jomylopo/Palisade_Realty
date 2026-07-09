import puppeteer from 'puppeteer-core';
import { mkdir } from 'fs/promises';
import { existsSync } from 'fs';

const dir = './temporary screenshots';
const exe = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

if (!existsSync(dir)) await mkdir(dir, { recursive: true });

const browser = await puppeteer.launch({
  executablePath: exe,
  args: ['--no-sandbox', '--disable-setuid-sandbox'],
});
const page = await browser.newPage();

// Desktop nav crop
await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });
await page.goto('http://localhost:3000', { waitUntil: 'networkidle2', timeout: 30000 });
await page.screenshot({ path: `${dir}/nav-desktop.png`, clip: { x: 0, y: 0, width: 1440, height: 135 } });
console.log('Desktop nav saved');

// Mobile nav crop
await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2 });
await page.reload({ waitUntil: 'networkidle2' });
await page.screenshot({ path: `${dir}/nav-mobile.png`, clip: { x: 0, y: 0, width: 390, height: 90 } });
console.log('Mobile nav saved');

await browser.close();
