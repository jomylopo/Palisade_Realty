import puppeteer from 'puppeteer-core';

const exe = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const b = await puppeteer.launch({ executablePath: exe, args: ['--no-sandbox', '--disable-setuid-sandbox'] });
const page = await b.newPage();
await page.setViewport({ width: 1440, height: 900 });

// Live index
await page.goto('https://palisade-realty-inky.vercel.app/', { waitUntil: 'networkidle2', timeout: 30000 });
const h1 = await page.$('header');
await h1.screenshot({ path: './temporary screenshots/live-nav-index.png' });

// Live community page
await page.goto('https://palisade-realty-inky.vercel.app/communities/downtown-san-diego-real-estate.html', { waitUntil: 'networkidle2', timeout: 30000 });
const h2 = await page.$('header');
await h2.screenshot({ path: './temporary screenshots/live-nav-community.png' });

await b.close();
console.log('done');
