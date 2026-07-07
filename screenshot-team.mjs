import puppeteer from 'puppeteer-core';
import { mkdir } from 'fs/promises';
import { existsSync } from 'fs';

const dir = './temporary screenshots';
const exe = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
if (!existsSync(dir)) await mkdir(dir, { recursive: true });

const browser = await puppeteer.launch({ executablePath: exe, args: ['--no-sandbox'] });
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1.5 });
await page.goto('http://localhost:3000/team.html', { waitUntil: 'networkidle2', timeout: 30000 });

// Pre-scroll so images load
const totalH = await page.evaluate(() => document.body.scrollHeight);
for (let y = 0; y < totalH; y += 500) {
  await page.evaluate(pos => window.scrollTo(0, pos), y);
  await new Promise(r => setTimeout(r, 60));
}

// Force all reveal animations visible (bypass IO timing issues)
await page.evaluate(() => {
  document.querySelectorAll('.reveal').forEach(el => el.classList.add('visible'));
});
await new Promise(r => setTimeout(r, 400));

// Get section top positions in page coordinates
const pos = await page.evaluate(() => {
  function top(sel) {
    const el = document.querySelector(sel);
    if (!el) return null;
    return Math.round(el.getBoundingClientRect().top + window.scrollY);
  }
  const sections = document.querySelectorAll('.tp-section');
  return {
    stats:      top('.tp-stats'),
    intro:      sections[0] ? Math.round(sections[0].getBoundingClientRect().top + window.scrollY) : null,
    leadership: sections[1] ? Math.round(sections[1].getBoundingClientRect().top + window.scrollY) : null,
    agents:     sections[2] ? Math.round(sections[2].getBoundingClientRect().top + window.scrollY) : null,
    why:        top('.tp-section--dark'),
    cta:        top('.tp-cta'),
    footer:     top('.site-footer'),
  };
});
console.log('Positions:', JSON.stringify(pos));

// Scroll back to top for first shots
await page.evaluate(() => window.scrollTo(0, 0));
await new Promise(r => setTimeout(r, 300));

// ── Hero ──────────────────────────────────────────────────────────
await page.screenshot({ path: `${dir}/screenshot-24-hero.png`, clip: { x:0, y:0, width:1440, height:780 } });
console.log('hero ✓');

// ── Stats ─────────────────────────────────────────────────────────
if (pos.stats != null) {
  await page.screenshot({ path: `${dir}/screenshot-25-stats.png`, clip: { x:0, y:pos.stats, width:1440, height:250 } });
  console.log('stats ✓');
}

// ── Company Intro ─────────────────────────────────────────────────
if (pos.intro != null) {
  await page.screenshot({ path: `${dir}/screenshot-26-intro.png`, clip: { x:0, y:pos.intro, width:1440, height:820 } });
  console.log('intro ✓');
}

// ── Leadership ────────────────────────────────────────────────────
if (pos.leadership != null) {
  await page.screenshot({ path: `${dir}/screenshot-27-leadership.png`, clip: { x:0, y:pos.leadership, width:1440, height:920 } });
  console.log('leadership ✓');
}

// ── Agents (top) ──────────────────────────────────────────────────
if (pos.agents != null) {
  await page.screenshot({ path: `${dir}/screenshot-28-agents.png`, clip: { x:0, y:pos.agents, width:1440, height:820 } });
  console.log('agents ✓');
}

// ── Why Palisade ──────────────────────────────────────────────────
if (pos.why != null) {
  // Scroll to section so it's fully painted
  await page.evaluate(y => window.scrollTo(0, y - 60), pos.why);
  await new Promise(r => setTimeout(r, 300));
  await page.screenshot({ path: `${dir}/screenshot-29-why.png`, clip: { x:0, y:pos.why, width:1440, height:820 } });
  console.log('why ✓');
}

// ── CTA + Footer ──────────────────────────────────────────────────
if (pos.cta != null) {
  await page.evaluate(y => window.scrollTo(0, y - 60), pos.cta);
  await new Promise(r => setTimeout(r, 300));
  const footerEnd = pos.footer != null ? (pos.footer + 320) : (pos.cta + 1100);
  const h = Math.min(footerEnd - pos.cta, 1100);
  await page.screenshot({ path: `${dir}/screenshot-30-cta-footer.png`, clip: { x:0, y:pos.cta, width:1440, height:h } });
  console.log('cta+footer ✓');
}

await browser.close();
console.log('All done');
