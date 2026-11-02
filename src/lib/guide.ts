import { steelMax, type Model, type Proc, type Volt } from '../data/models.ts';
import { BRAND_COPY } from '../data/brandCopy.ts';
import { VERDICTS } from '../data/verdicts.ts';
import { dutyMark, outletCircuit } from './plate.ts';

export type Block = { heading: string; paragraphs: string[] };

const PROC: Record<Proc, string> = {
  mig: 'MIG',
  flux: 'flux-cored',
  stick: 'stick',
  tig: 'TIG',
};

const METAL: Record<string, string> = {
  'mild-steel': 'mild steel',
  stainless: 'stainless',
  aluminum: 'aluminum',
  'cast-iron': 'cast iron',
};

function list(items: string[]): string {
  if (items.length === 0) return '';
  if (items.length === 1) return items[0];
  return `${items.slice(0, -1).join(', ')} and ${items[items.length - 1]}`;
}

function procs(m: Model): string {
  return list(m.procs.map((p) => PROC[p]));
}

function volts(m: Model): string {
  return list(m.voltages.map((v) => `${v} V`));
}

function sentences(blob: string): string[] {
  return blob
    .split(/(?<=\.)\s+/)
    .map((s) => s.trim())
    .filter(Boolean);
}

function packageSentences(m: Model): string[] {
  const blobs = [m.processes.text, m.input.text, m.wire.text, m.weight.text, ...m.notes];
  const hits: string[] = [];
  for (const blob of blobs) {
    for (const sentence of sentences(blob)) {
      if (/includ|comes complete|sample spool/i.test(sentence)) hits.push(sentence);
    }
  }
  return [...new Set(hits)];
}

function minuteReading(pct: number): string {
  const on = pct / 10;
  const off = (100 - pct) / 10;
  const num = (n: number) => (Number.isInteger(n) ? String(n) : n.toFixed(1));
  if (off === 0) return `${num(on)} minutes of welding in a 10-minute period, with no off time in that reading`;
  return `${num(on)} minutes of welding and ${num(off)} minutes off in a 10-minute period`;
}

function chipLine(m: Model, voltage: Volt, breaker: number, label: string): string {
  if (!m.voltages.includes(voltage)) {
    return `The ${m.name} does not publish ${voltage} V input, so the ${label} filter hides it.`;
  }
  const status = outletCircuit(m, voltage, breaker);
  if (status === 'pass') {
    return `On the ${label} outlet, the ${m.name} circuit check can pass for at least one process the sheet names.`;
  }
  if (status === 'warn') {
    return `On the ${label} outlet, the ${m.name} circuit check warns. The draw fits, or the sheet only partly covers that outlet, and there is no printed breaker size the checker can pass.`;
  }
  if (status === 'fail') {
    return `On the ${label} outlet, the ${m.name} circuit check fails. The published draw or the smallest named breaker is above that outlet.`;
  }
  return `On the ${label} outlet, the ${m.name} circuit check has no input-ampere row to score.`;
}

function drawLine(m: Model): string | null {
  if (!m.draws.length) return null;
  const bits = m.draws.map((d) => {
    const parts = [`${d.voltage} V`];
    if (d.process) parts.push(PROC[d.process]);
    if (d.onBreakerA != null) parts.push(`breaker row ${d.onBreakerA} A`);
    if (d.inputA != null) parts.push(`input ${d.inputA} A`);
    if (d.maxTimeDelayA != null) parts.push(`time-delay maximum ${d.maxTimeDelayA} A`);
    if (d.maxNormalFuseA != null) parts.push(`normal-fuse maximum ${d.maxNormalFuseA} A`);
    return parts.join(', ');
  });
  return `Rows stored for the ${m.name} job check: ${bits.join('; ')}.`;
}

function jobs(m: Model): string[] {
  const out = [
    `${m.name} publishes ${procs(m)}. ${m.processes.text}`,
    m.output.published ? `Output for the ${m.name}: ${m.output.text}` : `Output is not published for the ${m.name}.`,
  ];
  if (m.namedMetals.length) {
    out.push(`Metals named for the ${m.name}: ${list(m.namedMetals.map((metal) => METAL[metal] ?? metal))}.`);
  } else {
    out.push(`The ${m.name} page we cited does not name a weld metal. Unnamed metals stay unscored.`);
  }
  if (m.procs.includes('tig') && !m.namedMetals.includes('aluminum')) {
    out.push(
      m.acTig
        ? `The ${m.name} publishes AC TIG. Aluminum is still not named, so aluminum TIG is not a pass.`
        : `TIG on the ${m.name} is not published as AC, and aluminum is not named, so aluminum TIG fails.`,
    );
  } else if (m.acTig) {
    out.push(`The ${m.name} publishes AC TIG.`);
  }
  out.push(
    m.thickness.published
      ? `Thickness cell for the ${m.name}: ${m.thickness.text}`
      : `Material thickness is not published for the ${m.name}.`,
  );
  if (m.caps.length) {
    const single = m.caps.filter((c) => c.singlePass);
    out.push(`Thickness notes used by the job check for the ${m.name}: ${m.caps.map((c) => c.text).join(' ')}`);
    if (single.length) {
      out.push(
        `Where the ${m.name} sheet says single pass and prints no multi-pass maximum, a thicker job warns. It does not become a new maximum.`,
      );
    }
  } else {
    out.push(`No inch cap is stored for the ${m.name}, because the cited page did not print a numeric thickness the job check can use.`);
  }
  if (m.notes.length) out.push(m.notes.join(' '));
  return out;
}

function power(m: Model): string[] {
  const out = [
    `Input cell for the ${m.name}: ${m.input.text}`,
    `Published voltages for the ${m.name}: ${volts(m)}.`,
  ];
  const draws = drawLine(m);
  if (draws) out.push(draws);
  out.push(chipLine(m, 120, 15, '120 V / 15 A'));
  out.push(chipLine(m, 240, 50, '240 V / 50 A'));
  out.push(
    `Input current at rated output on the ${m.name} is a draw, not a breaker recommendation. 230 V counts as the 240 V outlet. 110 V and 115 V count as the 120 V outlet.`,
  );
  return out;
}

function duty(m: Model): string[] {
  if (!m.duty.published) {
    return [
      `Duty cycle is not published for the ${m.name}. The cell was checked at ${m.duty.cite.where}. No percent is filled in, and no minute figure is created.`,
    ];
  }
  const out = [`Duty cell for the ${m.name}: ${m.duty.text}`];
  const re = /(\d+(?:\.\d+)?)\s*(?:%|percent)/gi;
  let match: RegExpExecArray | null;
  let found = 0;
  while ((match = re.exec(m.duty.text))) {
    found += 1;
    const pct = Number(match[1]);
    const start = Math.max(0, match.index - 48);
    const context = m.duty.text.slice(start, match.index).replace(/\s+/g, ' ').trim();
    out.push(
      `The ${m.name} ${pct}% figure${context ? ` (${context})` : ''} reads as ${minuteReading(pct)}.`,
    );
  }
  if (!found) {
    out.push(`The ${m.name} duty cell does not include a percent, so it is left as printed.`);
  } else {
    out.push(`Those minute splits belong to the ${m.name} percents above. They are not an extra rating.`);
  }
  for (const voltage of m.voltages) {
    const mark = dutyMark(m.duty.text, voltage, m.voltages);
    if (!mark) {
      out.push(`No duty percent on the ${m.name} is tied to ${voltage} V.`);
    }
  }
  return out;
}

function box(m: Model): string[] {
  const hits = packageSentences(m);
  if (hits.length) {
    return [
      `Package lines printed for the ${m.name}: ${hits.join(' ')}`,
      `Wire cell for the ${m.name}: ${m.wire.text}`,
      `Weight cell for the ${m.name}: ${m.weight.text}`,
    ];
  }
  return [
    `The cited page for the ${m.name} does not list carton contents. A gun, cart, bottle, or starter spool is not added here.`,
    `Wire cell for the ${m.name}: ${m.wire.text}`,
    `Weight cell for the ${m.name}: ${m.weight.text}`,
  ];
}

function verdict(m: Model): string[] {
  const text = VERDICTS[m.slug];
  if (!text) throw new Error(`Missing verdict for ${m.slug}`);
  return [text];
}

export function modelBlocks(m: Model): Block[] {
  return [
    { heading: 'Best jobs', paragraphs: jobs(m) },
    { heading: 'Power needs', paragraphs: power(m) },
    { heading: 'Duty cycle', paragraphs: duty(m) },
    { heading: 'In the package', paragraphs: box(m) },
    { heading: 'Verdict', paragraphs: verdict(m) },
  ];
}

export function modelFaqs(m: Model) {
  return modelBlocks(m).map((block) => ({
    q: block.heading,
    a: block.paragraphs.join(' '),
  }));
}

function pairNote(a: Model, b: Model): string {
  const A = a.name;
  const B = b.name;
  const aw = a.weightLb != null ? `${a.weightLb} lb` : 'no single published weight';
  const bw = b.weightLb != null ? `${b.weightLb} lb` : 'no single published weight';
  const skuA = a.sku ? `catalog ${a.sku}` : 'no catalog number on the sheet';
  const skuB = b.sku ? `catalog ${b.sku}` : 'no catalog number on the sheet';
  return [
    `Keep the ${A} (${skuA}, ${aw}) in its own column from the ${B} (${skuB}, ${bw}).`,
    `The ${A} is filed under ${procs(a)} at ${volts(a)}. The ${B} is filed under ${procs(b)} at ${volts(b)}.`,
    `A job that needs a process printed only for the ${A} should not be scored against the ${B}, and a job that needs a process printed only for the ${B} should not be scored against the ${A}.`,
    `Duty percents for the ${A} stay on the ${A}. Duty percents for the ${B} stay on the ${B}. They are not averaged into one rating for this pair.`,
    `Thickness limits for the ${A} stay on the ${A} sheet, and thickness limits for the ${B} stay on the ${B} sheet. Where a sheet has no thickness, this ${A} versus ${B} page does not borrow one.`,
    `The outlet result for the ${A} can pass, warn, or fail on its own input line. The ${B} result is a separate pass, warn, or fail. Matching both to the same wall outlet is the point of reading them together.`,
    `Package sentences, if any, are quoted for the ${A} and the ${B} separately. A part listed for one machine is not treated as included with the other.`,
    `Use the ${A} column when its published limit covers the work, and the ${B} column when its published limit covers the work. Neither column is a price, a review score, or a substitute for the manual shipped with that machine.`,
  ].join(' ');
}

function pairVerdict(a: Model, b: Model): string[] {
  const sharedV = a.voltages.filter((v) => b.voltages.includes(v));
  const lines = [
    `Read the ${a.name} when you need ${procs(a)} on ${volts(a)}. Read the ${b.name} when you need ${procs(b)} on ${volts(b)}.`,
  ];
  if (a.weightLb != null && b.weightLb != null) {
    const lighter = a.weightLb === b.weightLb ? null : a.weightLb < b.weightLb ? a : b;
    const heavier = lighter && (lighter === a ? b : a);
    lines.push(
      lighter
        ? `Published weight is ${a.weight.text} for the ${a.name} and ${b.weight.text} for the ${b.name}. The lighter published figure is the ${lighter.name}; the heavier is the ${heavier?.name}.`
        : `Published weight matches at ${a.weight.text} for the ${a.name} and ${b.weight.text} for the ${b.name}.`,
    );
  } else {
    lines.push(`Weight cell for the ${a.name}: ${a.weight.text} Weight cell for the ${b.name}: ${b.weight.text}`);
  }
  for (const voltage of sharedV) {
    const da = dutyMark(a.duty.text, voltage, a.voltages);
    const db = dutyMark(b.duty.text, voltage, b.voltages);
    if (da && db && da.percent !== db.percent) {
      const higher = da.percent > db.percent ? a : b;
      const lower = higher === a ? b : a;
      const hi = higher === a ? da : db;
      const lo = higher === a ? db : da;
      lines.push(
        `At ${voltage} V the higher first duty percent is ${hi.percent}% on the ${higher.name}${hi.amps ? ` at ${hi.amps} A` : ''}, against ${lo.percent}% on the ${lower.name}${lo.amps ? ` at ${lo.amps} A` : ''}. A higher percent is more time at that printed output, not a higher amp rating.`,
      );
    }
    const sa = steelMax(a, voltage);
    const sb = steelMax(b, voltage);
    if (sa != null && sb != null && Math.abs(sa - sb) > 0.0001) {
      const thicker = sa > sb ? a : b;
      lines.push(
        `At ${voltage} V the larger stored mild-steel maximum is ${steelPhrase(thicker, voltage)}, compared with ${steelPhrase(thicker === a ? b : a, voltage)}.`,
      );
    }
  }
  const a120 = a.voltages.includes(120) ? outletCircuit(a, 120, 15) : 'hidden';
  const b120 = b.voltages.includes(120) ? outletCircuit(b, 120, 15) : 'hidden';
  const a240 = a.voltages.includes(240) ? outletCircuit(a, 240, 50) : 'hidden';
  const b240 = b.voltages.includes(240) ? outletCircuit(b, 240, 50) : 'hidden';
  lines.push(
    `Outlet check for the ${a.name}: ${a120} on 120 V / 15 A, ${a240} on 240 V / 50 A. Outlet check for the ${b.name}: ${b120} on 120 V / 15 A, ${b240} on 240 V / 50 A.`,
  );
  lines.push(
    `Pick the ${a.name} or the ${b.name} from those published limits. Build quality is not on either sheet, and this page has no price.`,
  );
  return lines;
}

function inchLabel(n: number): string {
  const known: [number, string][] = [
    [0.0625, '1/16 in'],
    [0.125, '1/8 in'],
    [0.1875, '3/16 in'],
    [0.25, '1/4 in'],
    [0.3125, '5/16 in'],
    [0.375, '3/8 in'],
    [0.4375, '7/16 in'],
    [0.5, '1/2 in'],
    [0.625, '5/8 in'],
    [0.75, '3/4 in'],
  ];
  for (const [value, label] of known) {
    if (Math.abs(value - n) < 0.0001) return label;
  }
  return `${n} in`;
}

function steelPhrase(m: Model, voltage: Volt): string {
  const max = steelMax(m, voltage);
  if (max == null) return `no mild-steel inch maximum stored for the ${m.name} at ${voltage} V`;
  const single = m.caps.some((c) => c.singlePass && c.maxIn != null && Math.abs(c.maxIn - max) < 0.0001);
  return `${inchLabel(max)}${single ? ' single pass' : ''} on the ${m.name}`;
}

export function compareBlocks(a: Model, b: Model): Block[] {
  const sharedP = a.procs.filter((p) => b.procs.includes(p)).map((p) => PROC[p]);
  const onlyA = a.procs.filter((p) => !b.procs.includes(p)).map((p) => PROC[p]);
  const onlyB = b.procs.filter((p) => !a.procs.includes(p)).map((p) => PROC[p]);
  const sharedV = a.voltages.filter((v) => b.voltages.includes(v));
  const onlyVa = a.voltages.filter((v) => !b.voltages.includes(v));
  const onlyVb = b.voltages.filter((v) => !a.voltages.includes(v));

  const jobs: string[] = [
    `This pair is published because the ${a.name} and the ${b.name} share ${list(sharedP)} and ${list(sharedV.map((v) => `${v} V`))} input. ${a.brand === b.brand ? `Both are ${a.brand}.` : `One is ${a.brand} and the other is ${b.brand}.`}`,
    `${a.summary} ${b.summary}`,
    onlyA.length ? `Only the ${a.name} lists ${list(onlyA)}.` : `The ${a.name} does not add a process the ${b.name} lacks.`,
    onlyB.length ? `Only the ${b.name} lists ${list(onlyB)}.` : `The ${b.name} does not add a process the ${a.name} lacks.`,
    `Thickness cell, ${a.name}: ${a.thickness.text}`,
    `Thickness cell, ${b.name}: ${b.thickness.text}`,
  ];
  for (const voltage of sharedV) {
    jobs.push(`At ${voltage} V the stored mild-steel maximum is ${steelPhrase(a, voltage)}, and ${steelPhrase(b, voltage)}.`);
  }

  const powerParas = [
    `Input cell, ${a.name}: ${a.input.text}`,
    `Input cell, ${b.name}: ${b.input.text}`,
    onlyVa.length ? `Only the ${a.name} publishes ${list(onlyVa.map((v) => `${v} V`))}.` : '',
    onlyVb.length ? `Only the ${b.name} publishes ${list(onlyVb.map((v) => `${v} V`))}.` : '',
    chipLine(a, 120, 15, '120 V / 15 A'),
    chipLine(b, 120, 15, '120 V / 15 A'),
    chipLine(a, 240, 50, '240 V / 50 A'),
    chipLine(b, 240, 50, '240 V / 50 A'),
  ].filter(Boolean);

  const dutyParas = [
    a.duty.published ? `Duty cell, ${a.name}: ${a.duty.text}` : `Duty cycle is not published for the ${a.name}.`,
    b.duty.published ? `Duty cell, ${b.name}: ${b.duty.text}` : `Duty cycle is not published for the ${b.name}.`,
  ];
  for (const voltage of sharedV) {
    const da = dutyMark(a.duty.text, voltage, a.voltages);
    const db = dutyMark(b.duty.text, voltage, b.voltages);
    if (da && db) {
      dutyParas.push(
        `First ${voltage} V duty percent: ${da.percent}%${da.amps ? ` at ${da.amps} A` : ''} on the ${a.name} (${minuteReading(da.percent)}), and ${db.percent}%${db.amps ? ` at ${db.amps} A` : ''} on the ${b.name} (${minuteReading(db.percent)}).`,
      );
    } else if (da) {
      dutyParas.push(`A ${voltage} V duty percent is printed for the ${a.name} (${da.percent}%) and not for the ${b.name}.`);
    } else if (db) {
      dutyParas.push(`A ${voltage} V duty percent is printed for the ${b.name} (${db.percent}%) and not for the ${a.name}.`);
    }
  }

  const boxParas = [
    ...packageSentences(a).slice(0, 2).map((s) => `${a.name}: ${s}`),
    ...packageSentences(b).slice(0, 2).map((s) => `${b.name}: ${s}`),
    `Weight cell, ${a.name}: ${a.weight.text}`,
    `Weight cell, ${b.name}: ${b.weight.text}`,
    `Wire cell, ${a.name}: ${a.wire.text}`,
    `Wire cell, ${b.name}: ${b.wire.text}`,
  ];
  if (packageSentences(a).length + packageSentences(b).length === 0) {
    boxParas.unshift(`Neither cited page lists a full carton for this pair. The weight and wire cells are the package facts that were printed.`);
  }

  const verdictParas = [...pairVerdict(a, b), pairNote(a, b)];

  return [
    { heading: 'Best jobs', paragraphs: jobs },
    { heading: 'Power needs', paragraphs: powerParas },
    { heading: 'Duty cycle', paragraphs: dutyParas },
    { heading: 'In the package', paragraphs: boxParas },
    { heading: 'Verdict', paragraphs: verdictParas },
  ];
}

export function brandBlocks(slug: string): Block[] {
  const paragraphs = BRAND_COPY[slug];
  if (!paragraphs?.length) throw new Error(`Missing brand copy for ${slug}`);
  return [
    { heading: 'What this brand page covers', paragraphs: paragraphs.slice(0, 1) },
    { heading: 'How the models differ', paragraphs: paragraphs.slice(1, -1) },
    { heading: 'Which page to open', paragraphs: paragraphs.slice(-1) },
  ];
}

export function blockWords(blocks: Block[]): number {
  return blocks
    .flatMap((b) => [b.heading, ...b.paragraphs])
    .join(' ')
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;
}
