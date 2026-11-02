import { writeFileSync } from 'node:fs';
import { models, pairs, brands, CHECKED } from '../src/data/models.ts';
import { pairIsUseful } from '../src/lib/guide.ts';
import { AMAZON_TAG, ASINS, amazonProductUrl, amazonSearchUrl, linkFor } from '../src/config/affiliate.ts';

const errors = [];
if (CHECKED !== '2026-11-02') errors.push('CHECKED date drifted');
if (AMAZON_TAG !== 'weldfacts-20') errors.push(`AMAZON_TAG is ${AMAZON_TAG}`);
const sample = amazonSearchUrl('Lincoln Power MIG 215 MPi welder');
if (!sample.includes('tag=weldfacts-20')) errors.push('search URL missing tag');
if (!sample.startsWith('https://www.amazon.com/s?k=')) errors.push('search URL shape');
for (const [slug, row] of Object.entries(ASINS)) {
  if (!models.some((m) => m.slug === slug)) errors.push(`ASIN key ${slug} is not a model`);
  const href = amazonProductUrl(row.asin);
  if (href !== `https://www.amazon.com/dp/${row.asin}?tag=weldfacts-20`) errors.push(`bad product url ${slug}`);
  if (linkFor(slug, 'x').kind !== 'product') errors.push(`linkFor missed ${slug}`);
}
if (models.length < 30) errors.push(`only ${models.length} models`);

const slugs = new Set();
for (const m of models) {
  if (slugs.has(m.slug)) errors.push(`duplicate slug ${m.slug}`);
  slugs.add(m.slug);
  const fields = [m.processes, m.output, m.duty, m.input, m.wire, m.weight, m.thickness];
  for (const field of fields) {
    if (!field?.cite?.url?.startsWith('https://')) errors.push(`${m.slug} missing source URL`);
    if (!field.cite.where) errors.push(`${m.slug} missing source note`);
    if (field.published && field.text.startsWith('Not published')) errors.push(`${m.slug} published row says unpublished`);
    if (!field.published && field.text !== 'Not published by manufacturer') errors.push(`${m.slug} unpublished text drifted: ${field.text}`);
    if (/\$\d/.test(field.text)) errors.push(`${m.slug} looks like a price`);
  }
  if (!m.productUrl.startsWith('https://')) errors.push(`${m.slug} bad product url`);
  if (!m.procs.length) errors.push(`${m.slug} has no process`);
  if (!m.voltages.length) errors.push(`${m.slug} has no voltage`);
  for (const cap of m.caps) {
    if (!m.procs.includes(cap.process)) errors.push(`${m.slug} cap process ${cap.process} not listed`);
    if (cap.voltage && !m.voltages.includes(cap.voltage)) errors.push(`${m.slug} cap voltage off input`);
    if (cap.maxIn != null && !(cap.maxIn > 0 && cap.maxIn < 2)) errors.push(`${m.slug} odd thickness ${cap.maxIn}`);
  }
  for (const draw of m.draws) {
    if (!m.voltages.includes(draw.voltage)) errors.push(`${m.slug} draw voltage off input`);
    if (draw.process && !m.procs.includes(draw.process)) errors.push(`${m.slug} draw process off list`);
  }
  if (m.weightLb != null && !m.weight.published) errors.push(`${m.slug} weight number without a published weight`);
  if (/dovnud|adsense|ca-pub-/i.test(JSON.stringify(m))) errors.push(`${m.slug} has a blocked string`);
}

const dates = {
  '/': CHECKED,
  '/models/': CHECKED,
  '/which-welder/': CHECKED,
  '/compare/': CHECKED,
  '/compare/best-for-120v/': CHECKED,
  '/compare/best-for-240v/': CHECKED,
  '/compare/best-multiprocess/': CHECKED,
  '/how-we-verify/': CHECKED,
  '/about/': CHECKED,
  '/contact/': CHECKED,
  '/privacy/': CHECKED,
  '/terms/': CHECKED,
  '/affiliate-disclosure/': CHECKED,
};
for (const m of models) dates[`/models/${m.slug}/`] = CHECKED;
for (const b of brands()) dates[`/brands/${b.slug}/`] = CHECKED;
for (const p of pairs()) dates[`/compare/${p.slug}/`] = CHECKED;
writeFileSync('src/data/page-dates.json', JSON.stringify(dates, null, 2) + '\n');

const noindex = pairs().filter((p) => !pairIsUseful(p.a, p.b)).map((p) => `/compare/${p.slug}/`);
writeFileSync('src/data/noindex-paths.json', JSON.stringify(noindex, null, 2) + '\n');

if (errors.length) {
  console.error(errors.join('\n'));
  process.exit(1);
}
console.log(`specs ok: ${models.length} models, ${pairs().length} comparisons`);
