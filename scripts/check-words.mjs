import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

const noindex = new Set(JSON.parse(readFileSync('src/data/noindex-paths.json', 'utf8')));

function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) walk(path, out);
    else out.push(path);
  }
  return out;
}

function pagePath(file) {
  let path = file.replace(/\\/g, '/').replace(/^dist/, '');
  path = path.replace(/index\.html$/, '');
  if (!path.endsWith('/')) path += '/';
  return path;
}

function mainText(html) {
  const main = html.match(/<main\b[^>]*>([\s\S]*?)<\/main>/i);
  const chunk = main ? main[1] : html;
  return chunk
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&#x27;/g, "'")
    .replace(/\s+/g, ' ')
    .trim();
}

const banned = [
  [/\u2014/, 'em dash'],
  [/editorial team/i, 'editorial team'],
  [/Sheet\. Outlet\. Job\./, 'slogan h1'],
  [/The short answer/i, 'short answer'],
  [/plain language/i, 'plain language'],
  [/\bactually\b/i, 'actually'],
  [/\bhonestly\b/i, 'honestly'],
];

const errors = [];
const htmlFiles = walk('dist').filter((file) => file.endsWith('.html'));
let checked = 0;
for (const file of htmlFiles) {
  const path = pagePath(file);
  const html = readFileSync(file, 'utf8');
  if (path === '/404/' || noindex.has(path) || /name="robots"[^>]*content="[^"]*noindex/i.test(html)) continue;
  checked++;
  const text = mainText(html);
  const count = text.split(/\s+/).filter(Boolean).length;
  if (count < 300) errors.push(`${path} ${count} words`);
  for (const [re, label] of banned) {
    if (re.test(text)) errors.push(`${path} contains ${label}`);
  }
}

const home = readFileSync('dist/index.html', 'utf8');
if (!home.includes('Welder specs and which one fits your outlet')) errors.push('homepage h1 missing');
if (!home.includes('tag=weldfacts-20') && !readFileSync('dist/models/millermatic-142/index.html', 'utf8').includes('tag=weldfacts-20')) {
  errors.push('amazon tag missing');
}
const modelHtml = readFileSync('dist/models/millermatic-142/index.html', 'utf8');
if (!modelHtml.includes('tag=weldfacts-20')) errors.push('model amazon tag missing');
if (!modelHtml.includes('application/ld+json')) errors.push('schema missing');
if (modelHtml.includes('color-scheme" content="dark"') || home.includes('color-scheme" content="dark"')) errors.push('dark color scheme');

const llms = readFileSync('dist/llms.txt', 'utf8');
const llmsFull = readFileSync('dist/llms-full.txt', 'utf8');
if (!llms.includes('# WeldFacts.com') || !llms.includes('contact@weldfacts.com') || !llms.includes('/models/millermatic-142/')) {
  errors.push('llms.txt incomplete');
}
if (!llmsFull.includes('Millermatic 142') || !llmsFull.includes('Not published by manufacturer')) errors.push('llms-full.txt incomplete');
for (const path of noindex) {
  if (llmsFull.includes(path) || llms.includes(path)) errors.push(`llms lists noindex ${path}`);
}

const robots = readFileSync('dist/robots.txt', 'utf8');
if (!robots.includes('Sitemap: https://weldfacts.com/sitemap-index.xml')) errors.push('robots sitemap missing');

const locs = new Set();
for (const file of walk('dist').filter((item) => item.endsWith('.xml'))) {
  const xml = readFileSync(file, 'utf8');
  for (const match of xml.matchAll(/<loc>([^<]+)<\/loc>/g)) locs.add(new URL(match[1]).pathname);
}
if (!locs.has('/')) errors.push('sitemap missing home');
if (!locs.has('/models/millermatic-142/')) errors.push('sitemap missing a model');
for (const path of noindex) {
  if (locs.has(path)) errors.push(`sitemap contains noindex ${path}`);
}
if (locs.has('/404/')) errors.push('sitemap contains 404');

if (errors.length) {
  console.error(errors.slice(0, 40).join('\n'));
  if (errors.length > 40) console.error(`... ${errors.length - 40} more`);
  process.exit(1);
}
console.log(`words ok: ${checked} indexable html pages, ${noindex.size} noindex comparisons excluded, sitemap ${locs.size} urls`);
