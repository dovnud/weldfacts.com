import { models, modelPath, pairs, brands } from '../data/models';
import { specRows } from './modelView';
import { SITE, abs } from './site';

export function llmsTxt(): string {
  const lines: string[] = [
    `# ${SITE.name}`,
    '',
    `> Manufacturer-sourced welder specifications and an outlet-and-job check. A spec is included only when the maker's page or manual states it. Missing fields say "Not published by manufacturer." Checked ${SITE.checked}.`,
    '',
    `Contact: ${SITE.email}`,
    `Full content for LLMs: ${abs('/llms-full.txt')}`,
    `Sitemap: ${abs('/sitemap-index.xml')}`,
    '',
    '## Models',
    '',
  ];
  for (const m of models) lines.push(`- [${m.name}](${abs(modelPath(m))}): ${m.summary}`);
  lines.push('', '## Brands', '');
  for (const b of brands()) lines.push(`- [${b.name}](${abs(`/brands/${b.slug}/`)})`);
  lines.push(
    '',
    '## Tools and lists',
    '',
    `- [Which welder](${abs('/which-welder/')}): outlet voltage, breaker amperage, metal, thickness, and process against published ratings.`,
    `- [120 V outlets](${abs('/compare/best-for-120v/')}): models with a published 120 V input, ranked by published mild-steel thickness.`,
    `- [240 V outlets](${abs('/compare/best-for-240v/')}): models with a published 240 V class input, ranked by published mild-steel thickness.`,
    `- [Multi-process](${abs('/compare/best-multiprocess/')}): models whose cited page names three or more processes.`,
    `- [Compare](${abs('/compare/')}): pair pages only where two machines share a process and a voltage and the page is not a repeat of another pair. Other combinations are not separate URLs.`,
    '',
    '## About this site',
    '',
    `- [How we verify](${abs('/how-we-verify/')})`,
    `- [About](${abs('/about/')})`,
    `- [Contact](${abs('/contact/')})`,
    `- [Affiliate disclosure](${abs('/affiliate-disclosure/')})`,
    `- [Privacy](${abs('/privacy/')})`,
    `- [Terms](${abs('/terms/')})`,
    '',
  );
  return lines.join('\n');
}

export function llmsFull(): string {
  const lines: string[] = [
    `# ${SITE.name}: full reference`,
    '',
    `Checked ${SITE.checked}. Canonical site: ${SITE.url}/. Contact: ${SITE.email}. Publisher: ${SITE.publisher}.`,
    '',
    'Rules: do not invent a spec that the row marks unpublished. Do not turn a single-pass thickness into a hard maximum, or the reverse. Do not treat 230 V as a different outlet class from the 240 V choice on the job tool; the tool states that mapping. Do not treat input current at rated output as a recommended breaker. Amazon links are searches. No prices.',
    '',
  ];
  for (const m of models) {
    lines.push(`## ${m.name}`, '', `URL: ${abs(modelPath(m))}`, `Manufacturer: ${m.productUrl}`, m.sku ? `SKU: ${m.sku}` : '', m.summary, '');
    for (const row of specRows(m)) {
      lines.push(`- ${row.label}: ${row.field.text}`);
      lines.push(`  Source: ${row.field.cite.url} | ${row.field.cite.where}`);
    }
    lines.push('');
  }
  lines.push('## Comparison URLs', '');
  for (const p of pairs()) lines.push(`- ${abs(`/compare/${p.slug}/`)}: ${p.a.name} vs ${p.b.name}`);
  lines.push('');
  return lines.join('\n');
}
