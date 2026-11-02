import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

const MIN = 300;
const MAX_OVERLAP = 0.6;
const banned = /\b(actually|honestly|honest|made-up)\b|—|editorial team|the short answer|plain language|plain answer/i;

function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) walk(path, out);
    else if (name.endsWith('.html')) out.push(path);
  }
  return out;
}

function visible(html) {
  const main = html.match(/<main\b[^>]*>[\s\S]*?<\/main>/i)?.[0] ?? '';
  return main
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&nbsp;/g, ' ')
    .replace(/&#\d+;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function words(text) {
  return text.split(/\s+/).filter(Boolean);
}

function shingles(text) {
  const tokens = text.toLowerCase().replace(/[^a-z0-9%./+]+/g, ' ').split(/\s+/).filter(Boolean);
  const set = new Set();
  for (let i = 0; i < tokens.length - 4; i++) set.add(tokens.slice(i, i + 5).join(' '));
  return set;
}

function overlap(a, b) {
  let inter = 0;
  const [small, big] = a.size < b.size ? [a, b] : [b, a];
  for (const item of small) if (big.has(item)) inter += 1;
  return inter / (Math.min(a.size, b.size) || 1);
}

const files = walk('dist');
const pages = [];
const errors = [];
for (const file of files) {
  const html = readFileSync(file, 'utf8');
  if (/noindex/i.test(html)) continue;
  const text = visible(html);
  const count = words(text).length;
  const rel = file.replace(/^dist\/?/, '/').replace(/index\.html$/, '');
  if (count < MIN) errors.push(`${rel || '/'} has ${count} words in main`);
  const hit = text.match(banned);
  if (hit) errors.push(`${rel || '/'} contains “${hit[0]}”`);
  pages.push({ rel: rel || '/', sh: shingles(text), count });
}

for (let i = 0; i < pages.length; i++) {
  for (let j = i + 1; j < pages.length; j++) {
    const score = overlap(pages[i].sh, pages[j].sh);
    if (score > MAX_OVERLAP) {
      errors.push(`${pages[i].rel} and ${pages[j].rel} overlap ${score.toFixed(2)}`);
    }
  }
}

if (errors.length) {
  console.error(errors.slice(0, 40).join('\n'));
  console.error(`${errors.length} content checks failed`);
  process.exit(1);
}
console.log(`words ok: ${pages.length} indexable pages, each at least ${MIN} words`);
