import { mkdirSync } from 'node:fs';
import sharp from 'sharp';
import { models, brands } from '../src/data/models.ts';

const pages = [
  ['default', 'WeldFacts', 'Manufacturer amps. No guessed specs.'],
  ['page-models', 'Models', 'One cited table per welder.'],
  ['page-which-welder', 'Which welder', 'Outlet, metal, thickness, process.'],
  ['page-compare', 'Compare', 'Two models, the same fields, two sources.'],
  ['page-120v', '120 V outlets', 'Published 120 V input, then thickness.'],
  ['page-240v', '240 V outlets', '230 V and 240 V, as the sheet prints them.'],
  ['page-multi', 'Multi-process', 'Three named processes, or it is not on the list.'],
  ['page-how-we-verify', 'How we verify', 'A source URL on every row.'],
  ['page-about', 'About', 'WeldFacts editorial team.'],
  ['page-contact', 'Contact', 'contact@weldfacts.com'],
  ['page-privacy', 'Privacy', 'No ads. The check stays in the browser.'],
  ['page-terms', 'Terms', 'The manufacturer manual still governs the machine.'],
  ['page-affiliate-disclosure', 'Affiliate disclosure', 'Amazon searches. No prices. Tag not active yet.'],
  ...brands().map((b) => [`brand-${b.slug}`, b.name, 'Cited welder specs']),
  ...models.map((m) => [`model-${m.slug}`, m.name, m.duty.published ? m.duty.text.slice(0, 80) : 'Specs from the manufacturer page']),
];

function esc(value) {
  return String(value).replace(/[&<>"]/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[ch]));
}

function svg(title, sub) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
  <rect width="1200" height="630" fill="#1c2430"/>
  <rect x="0" y="0" width="1200" height="14" fill="#f0b429"/>
  <text x="72" y="180" fill="#f0b429" font-family="Outfit, Arial, sans-serif" font-size="28" font-weight="700" letter-spacing="4">WELDFACTS.COM</text>
  <text x="72" y="320" fill="#f7f4ee" font-family="Outfit, Arial, sans-serif" font-size="64" font-weight="700">${esc(title)}</text>
  <text x="72" y="400" fill="#d9d0c3" font-family="Arial, sans-serif" font-size="32">${esc(sub)}</text>
  <rect x="72" y="470" width="180" height="14" rx="7" fill="#f0b429"/>
  <rect x="264" y="470" width="72" height="14" rx="7" fill="#f0b429" opacity="0.7"/>
  <rect x="348" y="470" width="36" height="14" rx="7" fill="#f0b429" opacity="0.45"/>
</svg>`;
}

mkdirSync('public/og', { recursive: true });
for (const [name, title, sub] of pages) {
  const short = title.length > 42 ? `${title.slice(0, 40)}…` : title;
  const subShort = sub.length > 70 ? `${sub.slice(0, 68)}…` : sub;
  await sharp(Buffer.from(svg(short, subShort))).png().toFile(`public/og/${name}.png`);
}
console.log(`og images: ${pages.length}`);
