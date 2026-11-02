import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { readFileSync } from 'node:fs';

// lastmod comes from src/data/page-dates.json, written by scripts/check-specs.mjs
// from the date each manufacturer page was read. A path missing from the file
// is left without <lastmod> rather than given a made-up date.
const lastmodByPath = JSON.parse(readFileSync('./src/data/page-dates.json', 'utf8'));
const noindexPaths = new Set(JSON.parse(readFileSync('./src/data/noindex-paths.json', 'utf8')));

const MONEY = new Set([
  '/compare/best-for-120v/',
  '/compare/best-for-240v/',
  '/compare/best-multiprocess/',
  '/models/',
  '/which-welder/',
]);

const FAMILY = [
  ['miller', ['millermatic', 'multimatic', 'thunderbolt', 'maxstar', 'syncrowave', 'dynasty']],
  ['hobart', ['multi-handler', 'handler', 'ironman']],
  ['lincoln', ['power-mig', 'square-wave']],
  ['esab', ['rebel']],
  ['primeweld', ['tig225x', 'tig325x', 'tig230', 'tig200', 'mig285']],
  ['harbor-freight', ['unlimited']],
];

function brandOf(slug) {
  for (const [family, prefixes] of FAMILY) {
    if (prefixes.some((p) => slug === p || slug.startsWith(`${p}-`) || slug.startsWith(p))) return family;
  }
  return slug;
}

/** Buyer pages outrank reference and legal URLs. Same-brand comparisons outrank the long cross-brand set. */
function sitemapPriority(path) {
  if (path === '/') return 1;
  if (MONEY.has(path)) return 0.9;
  if (path.startsWith('/models/') && path !== '/models/') return 0.8;
  const pair = path.match(/^\/compare\/(.+)\/$/);
  if (pair && pair[1].includes('-vs-')) {
    const [a, b] = pair[1].split('-vs-');
    return brandOf(a) === brandOf(b) ? 0.7 : 0.4;
  }
  if (path.startsWith('/brands/')) return 0.6;
  if (path === '/compare/') return 0.7;
  return 0.3;
}

export default defineConfig({
  site: 'https://weldfacts.com',
  output: 'static',
  trailingSlash: 'always',
  build: { format: 'directory', inlineStylesheets: 'always' },
  compressHTML: true,
  integrations: [
    sitemap({
      filter: (page) => {
        const path = new URL(page).pathname;
        return path !== '/404/' && !noindexPaths.has(path);
      },
      serialize(item) {
        const path = new URL(item.url).pathname;
        if (lastmodByPath[path]) item.lastmod = new Date(`${lastmodByPath[path]}T00:00:00Z`).toISOString();
        else delete item.lastmod;
        item.priority = sitemapPriority(path);
        return item;
      },
    }),
  ],
});
