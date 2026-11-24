// Prints the site's own /cv page to public/cv.pdf so the download always matches the page.
// Run after `npm run build`: npm run cv-pdf
import { spawn } from 'node:child_process';
import { chromium } from '@playwright/test';

const PORT = 4323;
const server = spawn('npx', ['sirv', 'dist', '--port', String(PORT), '--quiet'], { stdio: 'ignore' });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
for (let i = 0; i < 40; i++) {
  try { if ((await fetch(`http://localhost:${PORT}/`)).ok) break; } catch {}
  await sleep(250);
}
const browser = await chromium.launch();
try {
  const page = await browser.newPage();
  await page.goto(`http://localhost:${PORT}/cv`);
  await page.emulateMedia({ media: 'print', colorScheme: 'light' });
  await page.pdf({ path: 'public/cv.pdf', format: 'A4', margin: { top: '16mm', bottom: '16mm', left: '14mm', right: '14mm' }, printBackground: false });
  console.log('wrote public/cv.pdf');
} finally {
  await browser.close();
  server.kill();
}
