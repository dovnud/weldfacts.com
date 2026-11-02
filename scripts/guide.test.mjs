import { brands, getModel, models, pairs } from '../src/data/models.ts';
import { brandSections, modelSections, pairIsUseful, pairSections, sectionWords } from '../src/lib/guide.ts';

const banned = [
  [/\u2014/, 'em dash'],
  [/\bactually\b/i, 'actually'],
  [/\bhonestly\b/i, 'honestly'],
  [/editorial team/i, 'editorial team'],
  [/the short answer/i, 'short answer'],
  [/plain language/i, 'plain language'],
  [/Sheet\. Outlet\. Job\./, 'slogan h1'],
];

function assertClean(label, sections) {
  const text = sections.flatMap((section) => [section.heading, ...section.paragraphs]).join('\n');
  for (const [re, name] of banned) {
    if (re.test(text)) throw new Error(`${label} contains ${name}`);
  }
  if (/\$\d/.test(text)) throw new Error(`${label} looks like a price`);
}

let thin = 0;
for (const model of models) {
  const sections = modelSections(model);
  assertClean(model.slug, sections);
  const words = sectionWords(sections);
  if (words < 280) {
    thin++;
    console.error(`${model.slug} guide is ${words} words`);
  }
  const joined = sections.flatMap((section) => section.paragraphs).join(' ');
  if (!model.duty.published && !/does not publish a duty cycle/.test(joined)) {
    throw new Error(`${model.slug} missing duty should say it is unpublished`);
  }
  if (!joined.includes(model.summary)) throw new Error(`${model.slug} verdict dropped the summary`);
}
if (thin) throw new Error(`${thin} model guides under 280 words`);

const a = getModel('millermatic-142');
const b = getModel('dynasty-210');
const c = getModel('millermatic-211-pro');
const tig = getModel('tig200');
if (pairIsUseful(a, tig)) throw new Error('142 vs PrimeWeld TIG200 should be noindex');
if (!pairIsUseful(a, b)) throw new Error('same-brand pair should stay indexed when processes differ');
if (!pairIsUseful(a, c)) throw new Error('same-brand MIG pair should be indexed');
if (!pairIsUseful(getModel('mig285'), getModel('unlimited-140'))) throw new Error('shared process should be indexed');

let thinPairs = 0;
for (const pair of pairs()) {
  if (!pairIsUseful(pair.a, pair.b)) continue;
  const sections = pairSections(pair.a, pair.b);
  assertClean(pair.slug, sections);
  if (sectionWords(sections) < 280) {
    thinPairs++;
    console.error(`${pair.slug} comparison is ${sectionWords(sections)} words`);
  }
}
if (thinPairs) throw new Error(`${thinPairs} comparisons under 280 words`);

for (const brand of brands()) {
  const list = models.filter((model) => model.brandSlug === brand.slug);
  const sections = brandSections(brand.name, list);
  assertClean(brand.slug, sections);
  const words = sectionWords(sections);
  if (words < 300) throw new Error(`${brand.slug} brand guide is ${words} words`);
}

const indexed = pairs().filter((pair) => pairIsUseful(pair.a, pair.b)).length;
console.log(`guide tests ok: ${models.length} models, ${indexed} indexed comparisons, ${pairs().length - indexed} noindex`);
