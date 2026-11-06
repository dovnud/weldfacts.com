import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { models, modelPath } from '../src/data/models.ts';
import { ASINS, AMAZON_TAG } from '../src/config/affiliate.ts';
import { modelPageLd } from '../src/lib/modelView.ts';
import { SITE } from '../src/lib/site.ts';

const errors = [];
const checkDist = process.argv.includes('--dist');

const BANNED_TYPES = new Set(['Product', 'Offer', 'AggregateOffer', 'AggregateRating', 'Review', 'Rating']);
const COMMERCE_KEYS = [
  'offers',
  'review',
  'aggregateRating',
  'price',
  'priceCurrency',
  'priceSpecification',
  'lowPrice',
  'highPrice',
  'availability',
  'ratingValue',
  'reviewCount',
  'ratingCount',
];

function walkFiles(dir, out = []) {
  for (const name of readdirSync(dir)) {
    if (name === 'node_modules' || name === 'dist') continue;
    const path = join(dir, name);
    if (statSync(path).isDirectory()) walkFiles(path, out);
    else out.push(path);
  }
  return out;
}

function declaresProduct(text) {
  return (
    /['"]@type['"]\s*:\s*\[[^\]]*['"]Product['"]/.test(text) ||
    /['"]@type['"]\s*:\s*['"]Product['"]/.test(text) ||
    /schema\.org\/Product\b/.test(text) ||
    /itemtype\s*=\s*['"][^'"]*Product/.test(text) ||
    /typeof\s*=\s*['"][^'"]*\bProduct\b/.test(text)
  );
}

for (const file of walkFiles('src')) {
  if (!/\.(astro|ts|js|mjs|html)$/.test(file)) continue;
  if (declaresProduct(readFileSync(file, 'utf8'))) errors.push(`${file} marks a page up as Product`);
}

const modelPage = readFileSync('src/pages/models/[slug].astro', 'utf8');
if (!modelPage.includes('modelPageLd(')) errors.push('model template does not emit modelPageLd');
if (modelPage.includes('productLd')) errors.push('model template still references productLd');

function visit(node, fn) {
  if (Array.isArray(node)) {
    for (const item of node) visit(item, fn);
    return;
  }
  if (!node || typeof node !== 'object') return;
  fn(node);
  for (const value of Object.values(node)) visit(value, fn);
}

function typesIn(node) {
  const types = new Set();
  visit(node, (item) => {
    const type = item['@type'];
    if (typeof type === 'string') types.add(type);
    else if (Array.isArray(type)) for (const part of type) if (typeof part === 'string') types.add(part);
  });
  return types;
}

function commerceKeys(node) {
  const found = [];
  visit(node, (item) => {
    for (const key of COMMERCE_KEYS) if (Object.prototype.hasOwnProperty.call(item, key)) found.push(key);
  });
  return found;
}

for (const [slug, row] of Object.entries(ASINS)) {
  for (const key of ['price', 'priceCurrency', 'availability', 'ratingValue', 'reviewCount']) {
    if (Object.prototype.hasOwnProperty.call(row, key)) errors.push(`${slug} Amazon record has ${key}`);
  }
}
if (AMAZON_TAG !== 'weldfacts-20') errors.push(`AMAZON_TAG is ${AMAZON_TAG}`);

for (const model of models) {
  const graph = modelPageLd(model, SITE.checked);
  const types = typesIn(graph);
  if (!types.has('WebPage')) errors.push(`${model.slug} JSON-LD has no WebPage`);
  if (!types.has('BreadcrumbList')) errors.push(`${model.slug} JSON-LD has no BreadcrumbList`);
  if (!types.has('FAQPage')) errors.push(`${model.slug} JSON-LD has no FAQPage`);
  for (const type of types) {
    if (BANNED_TYPES.has(type)) errors.push(`${model.slug} JSON-LD includes ${type}`);
  }
  const commerce = commerceKeys(graph);
  if (commerce.length) errors.push(`${model.slug} JSON-LD includes ${commerce.join(', ')}`);
  const page = graph[0];
  const expectedUrl = `${SITE.url}${modelPath(model)}`;
  if (page.url !== expectedUrl) errors.push(`${model.slug} WebPage url is ${page.url}`);
  if (page['@type'] !== 'WebPage') errors.push(`${model.slug} first node is ${page['@type']}`);
  if (page.description !== model.summary) errors.push(`${model.slug} WebPage description drifted`);
  const crumbNames = graph[1].itemListElement.map((item) => item.name).join('|');
  if (crumbNames !== `Home|Models|${model.name}`) errors.push(`${model.slug} breadcrumbs are ${crumbNames}`);
  const blob = JSON.stringify(graph);
  if (blob.includes(AMAZON_TAG)) errors.push(`${model.slug} JSON-LD embeds the Amazon tag`);
}

function htmlFiles(dir, out = []) {
  for (const name of readdirSync(dir)) {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) htmlFiles(path, out);
    else if (name.endsWith('.html')) out.push(path);
  }
  return out;
}

function jsonLdBlocks(html) {
  const blocks = [];
  const re = /<script type="application\/ld\+json">([\s\S]*?)<\/script>/g;
  let match;
  while ((match = re.exec(html))) blocks.push(match[1]);
  return blocks;
}

if (checkDist) {
  if (!existsSync('dist')) errors.push('dist is missing');
  else {
    const seen = new Set();
    for (const file of htmlFiles('dist')) {
      const html = readFileSync(file, 'utf8');
      if (declaresProduct(html)) errors.push(`${file} marks a page up as Product`);
      const blocks = jsonLdBlocks(html);
      let parsed;
      try {
        parsed = blocks.map((block) => JSON.parse(block));
      } catch (error) {
        errors.push(`${file} has unparsable JSON-LD: ${error.message}`);
        continue;
      }
      const types = typesIn(parsed);
      for (const type of types) {
        if (BANNED_TYPES.has(type)) errors.push(`${file} renders ${type}`);
      }
      const commerce = commerceKeys(parsed);
      if (commerce.length) errors.push(`${file} renders ${commerce.join(', ')}`);
      const rel = `/${file.slice('dist/'.length).replace(/index\.html$/, '')}`;
      const model = models.find((item) => modelPath(item) === rel);
      if (!model) continue;
      seen.add(model.slug);
      if (!types.has('WebPage')) errors.push(`${rel} built page has no WebPage`);
      if (!html.includes(`tag=${AMAZON_TAG}`)) errors.push(`${rel} dropped the Amazon tag`);
      const verified = ASINS[model.slug];
      if (verified && !html.includes(`/dp/${verified.asin}?tag=${AMAZON_TAG}`)) {
        errors.push(`${rel} product link changed`);
      }
      if (!verified && html.includes('/dp/')) errors.push(`${rel} gained a product link`);
    }
    for (const model of models) {
      if (!seen.has(model.slug)) errors.push(`built site is missing ${modelPath(model)}`);
    }
  }
}

if (errors.length) {
  console.error(errors.join('\n'));
  process.exit(1);
}
console.log(`schema ok: ${models.length} model pages are WebPage${checkDist ? ', dist checked' : ''}`);
