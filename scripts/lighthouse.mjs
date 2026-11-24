// Runs Lighthouse against the built site (dist/) served locally and fails below thresholds.
import { spawn } from 'node:child_process';
import { launch } from 'chrome-launcher';
import lighthouse from 'lighthouse';
import { chromium } from '@playwright/test';

const PORT = 4322;
const routes = ['/', '/work', '/cv', '/contact', '/work/agentic-testing-pipeline'];
const override = process.env.LH_MIN_ALL ? Number(process.env.LH_MIN_ALL) : null;
const min = { accessibility: override ?? 0.95, performance: override ?? 0.9, 'best-practices': override ?? 0.9, seo: override ?? 0.9 };

const server = spawn('npx', ['sirv', 'dist', '--port', String(PORT), '--quiet'], { stdio: 'ignore' });
const stop = () => server.kill();
process.on('exit', stop);

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
for (let i = 0; i < 40; i++) {
  try { if ((await fetch(`http://localhost:${PORT}/`)).ok) break; } catch {}
  await sleep(250);
}

const chrome = await launch({ chromePath: chromium.executablePath(), chromeFlags: ['--headless=new', '--no-sandbox'] });
let failed = 0;
try {
  for (const route of routes) {
    const { lhr } = await lighthouse(`http://localhost:${PORT}${route}`, { port: chrome.port, output: 'json', logLevel: 'error' });
    for (const [cat, threshold] of Object.entries(min)) {
      const score = lhr.categories[cat].score;
      const ok = score >= threshold;
      if (!ok) failed++;
      console.log(`${ok ? 'ok  ' : 'FAIL'} ${route} ${cat}: ${score} (min ${threshold})`);
    }
  }
} finally {
  await chrome.kill();
  stop();
}
process.exit(failed ? 1 : 0);
