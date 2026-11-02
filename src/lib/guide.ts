import type { Model, Proc, Volt } from '../data/models.ts';
import { steelMax } from '../data/models.ts';
import type { CheckStatus } from './job.ts';
import { dutyMark, outletCircuit, plugLine } from './plate.ts';

export type Section = { heading: string; paragraphs: string[] };

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

const INCH: Record<string, string> = {
  '0.0625': '1/16 in',
  '0.125': '1/8 in',
  '0.1875': '3/16 in',
  '0.25': '1/4 in',
  '0.3125': '5/16 in',
  '0.375': '3/8 in',
  '0.4375': '7/16 in',
  '0.5': '1/2 in',
  '0.625': '5/8 in',
  '0.75': '3/4 in',
};

const INCLUDE_RE = /\b(included|includes|comes complete|come complete|ready to weld|power cords are included)\b/i;

function fmtIn(n: number): string {
  const key = String(n);
  if (INCH[key]) return INCH[key];
  const rounded = String(Math.round(n * 10000) / 10000);
  return INCH[rounded] ?? `${n} in`;
}

function list(items: string[]): string {
  if (items.length <= 1) return items[0] ?? '';
  if (items.length === 2) return `${items[0]} and ${items[1]}`;
  return `${items.slice(0, -1).join(', ')}, and ${items[items.length - 1]}`;
}

function procList(procs: Proc[]): string {
  return list(procs.map((p) => PROC[p]));
}

function labelStatus(status: CheckStatus): string {
  if (status === 'pass') return 'a pass';
  if (status === 'warn') return 'a warning';
  if (status === 'fail') return 'a fail';
  return 'not scored';
}

function minutes(percent: number): string {
  const on = percent / 10;
  const off = (100 - percent) / 10;
  const fmt = (n: number) => (Number.isInteger(n) ? String(n) : n.toFixed(1));
  return `${fmt(on)} minutes welding and ${fmt(off)} minutes off`;
}

/** Same-brand pairs, and cross-brand pairs that share a process, can be compared on published fields. */
export function pairIsUseful(a: Model, b: Model): boolean {
  if (a.brandSlug === b.brandSlug) return true;
  return a.procs.some((p) => b.procs.includes(p));
}

export function sectionWords(sections: Section[]): number {
  return sections
    .flatMap((section) => [section.heading, ...section.paragraphs])
    .join(' ')
    .split(/\s+/)
    .filter(Boolean).length;
}

function packageSentences(m: Model): string[] {
  const blobs = [m.processes, m.output, m.duty, m.input, m.wire, m.weight, m.thickness]
    .filter((field) => field.published)
    .map((field) => field.text);
  const found: string[] = [];
  for (const blob of blobs) {
    for (const part of blob.split(/(?<=\.)\s+/)) {
      const sentence = part.trim();
      if (INCLUDE_RE.test(sentence) && !found.includes(sentence)) found.push(sentence);
    }
  }
  return found;
}

function circuitSentence(m: Model, voltage: Volt, breakerA: number): string {
  const status = outletCircuit(m, voltage, breakerA);
  const outlet = voltage === 120 ? '120 V / 15 A' : '240 V / 50 A';
  if (!m.voltages.includes(voltage)) {
    return `${m.name} does not list ${voltage} V input, so the ${outlet} chip is a fail.`;
  }
  if (status === 'pass') {
    return `On a ${outlet} outlet, ${m.name} is a pass: a breaker size printed for that voltage fits.`;
  }
  if (status === 'warn') {
    return `On a ${outlet} outlet, ${m.name} is a warning. The published input current fits that breaker, and the sheet does not name a breaker size. A warning is not a pass.`;
  }
  if (status === 'fail') {
    return `On a ${outlet} outlet, ${m.name} is a fail. The published input current or breaker row does not fit.`;
  }
  return `On a ${outlet} outlet, ${m.name} is not scored. The sheet does not print the input current that check needs.`;
}

function dutyPlain(m: Model, voltage: Volt): string | null {
  const mark = dutyMark(m.duty.text, voltage, m.voltages);
  if (!mark) return null;
  const clause = /[.!?]$/.test(mark.clause.trim()) ? mark.clause.trim() : `${mark.clause.trim()}.`;
  const scope = mark.split
    ? `That clause names ${voltage} V.`
    : `That clause does not name a voltage. ${m.name} lists ${voltage} V, so the bar uses this percent for that outlet.`;
  return `The duty bar for ${voltage} V uses the first percent in this clause: ${clause} That is ${mark.percent}% of a 10-minute test, which is ${minutes(mark.percent)}. ${scope} Any later percent in the duty cell stays in the sentence above and is not turned into a second bar.`;
}

function bestJobs(m: Model): Section {
  const paragraphs: string[] = [];
  paragraphs.push(
    `${m.name}${m.sku ? ` (SKU ${m.sku})` : ''} publishes ${procList(m.procs)}. The process cell reads: ${m.processes.text}`,
  );
  if (m.output.published) paragraphs.push(`Published output: ${m.output.text}`);
  if (m.caps.length) {
    paragraphs.push(`Thickness lines the job check uses, each copied from the cited page: ${m.caps.map((cap) => cap.text).join(' ')}`);
  } else if (m.thickness.published) {
    paragraphs.push(
      `Thickness cell: ${m.thickness.text} No separate inch cap was stored from that sentence, so the job check does not invent one.`,
    );
  } else {
    paragraphs.push(
      `${m.name} has no published material thickness on the cited page. The job check does not pass or fail a thickness. A missing thickness is not read as permission to weld any thickness.`,
    );
  }
  const metalNames = m.namedMetals.map((metal) => METAL[metal] ?? metal);
  if (metalNames.length) {
    const aluminumRule = m.procs.includes('tig')
      ? ' Aluminum on TIG fails when the page never names aluminum.'
      : '';
    paragraphs.push(`Metals named on the cited page: ${list(metalNames)}. A metal that is not named is left unscored.${aluminumRule}`);
  } else if (m.procs.includes('tig')) {
    paragraphs.push(
      `The cited page does not name a metal for ${m.name}. Unnamed metals stay unscored. Aluminum on TIG fails when the page never names aluminum.`,
    );
  } else {
    paragraphs.push(`The cited page does not name a metal for ${m.name}. Unnamed metals stay unscored.`);
  }
  if (m.acTig) {
    paragraphs.push(`${m.name} publishes AC TIG. This page does not add metals the sheet left off.`);
  } else if (m.procs.includes('tig')) {
    paragraphs.push(`AC TIG is not published for ${m.name}.`);
  }
  const jobs = m.voltages.map((voltage) => {
    const max = steelMax(m, voltage);
    if (max == null) return `${voltage} V ${procList(m.procs)}, with no mild-steel inch maximum stored`;
    const single = m.caps.some(
      (cap) => cap.singlePass && cap.maxIn === max && (cap.voltage == null || cap.voltage === voltage),
    );
    return `${voltage} V work up to ${fmtIn(max)} where the sheet states that mild-steel figure${single ? ' as a single pass' : ''}`;
  });
  paragraphs.push(`Best jobs, limited to those published figures: ${list(jobs)}.`);
  return { heading: `Best jobs for the ${m.name}`, paragraphs };
}

function powerNeeds(m: Model): Section {
  const paragraphs: string[] = [`Input cell: ${m.input.text}`];
  if (m.draws.length) {
    const rows = m.draws.map((draw) => {
      const bits = [`${draw.voltage} V${draw.process ? ` ${PROC[draw.process]}` : ''}`];
      if (draw.inputA != null) bits.push(`${draw.inputA} A input current at the published rating`);
      if (draw.onBreakerA != null) bits.push(`${draw.onBreakerA} A breaker named on the sheet`);
      if (draw.maxTimeDelayA != null) bits.push(`time-delay fuse maximum ${draw.maxTimeDelayA} A`);
      if (draw.maxNormalFuseA != null) bits.push(`normal fuse maximum ${draw.maxNormalFuseA} A`);
      return bits.join(', ');
    });
    paragraphs.push(`Rows the outlet check reads: ${rows.join('. ')}.`);
  } else {
    paragraphs.push(`No separate input-current row is stored for ${m.name}. The check uses the input cell only.`);
  }
  paragraphs.push(circuitSentence(m, 120, 15));
  paragraphs.push(circuitSentence(m, 240, 50));
  paragraphs.push(
    `Plug line taken from that input text: ${plugLine(m.input.text)}. A plug name is not a breaker size, and input current at rated output is not a recommended breaker unless the sheet names the breaker.`,
  );
  return { heading: `Power needs for the ${m.name}`, paragraphs };
}

function dutyCycle(m: Model): Section {
  if (!m.duty.published) {
    return {
      heading: `Duty cycle for the ${m.name}`,
      paragraphs: [
        `${m.name} does not publish a duty cycle on the page cited here. There is no percent to convert into minutes.`,
        `When a manufacturer does print a duty cycle, it is the share of a 10-minute test the machine can weld at a stated output. This site does not fill in 20%, 60%, or any other percent the sheet left blank.`,
        `The duty cell stays "Not published by manufacturer."`,
      ],
    };
  }
  const paragraphs = [`Duty cell: ${m.duty.text}`];
  for (const voltage of m.voltages) {
    paragraphs.push(
      dutyPlain(m, voltage) ??
        `No duty percent in that cell is tied to ${voltage} V. The bar for ${voltage} V stays empty. A missing percent is not treated as continuous duty.`,
    );
  }
  paragraphs.push(
    `Duty cycle is not a metal thickness and not the breaker in the panel. Compare two percents only when you also read the amperage in the same phrase. A higher percent at a lower amperage is continuous at that lower output, not at the top of the amp range.`,
  );
  return { heading: `Duty cycle for the ${m.name}`, paragraphs };
}

function included(m: Model): Section {
  const packed = packageSentences(m);
  const paragraphs: string[] = [];
  if (packed.length) {
    paragraphs.push(
      `These sentences are already in the transcribed fields. They are the only inclusion claims this page makes: ${packed.join(' ')}`,
    );
  } else {
    paragraphs.push(
      `The fields transcribed for ${m.name} do not list carton contents. No sentence names an included gun, torch, cord, or spool as a package inventory. This page does not guess a box list from a similar model.`,
    );
  }
  if (m.wire.published) {
    paragraphs.push(`Wire or rod the sheet says the machine accepts: ${m.wire.text} Accepting a wire size is not the same thing as shipping a spool of that wire.`);
  } else {
    paragraphs.push(`A wire or rod diameter is not published for ${m.name}.`);
  }
  if (m.weight.published) paragraphs.push(`Published weight and size notes: ${m.weight.text}`);
  else paragraphs.push(`A machine weight is not published for ${m.name}.`);
  return { heading: `What is included with the ${m.name}`, paragraphs };
}

function verdict(m: Model): Section {
  const missing = [
    ['output range', m.output.published],
    ['duty cycle', m.duty.published],
    ['material thickness', m.thickness.published],
    ['weight', m.weight.published],
    ['wire or rod size', m.wire.published],
  ]
    .filter(([, published]) => !published)
    .map(([name]) => name as string);
  const paragraphs = [
    m.summary,
    `Chip results, using only the published circuit rows: 120 V / 15 A is ${labelStatus(outletCircuit(m, 120, 15))}, and 240 V / 50 A is ${labelStatus(outletCircuit(m, 240, 50))}.`,
  ];
  const single = [...new Set(m.caps.filter((cap) => cap.singlePass).map((cap) => cap.text))];
  if (single.length) {
    paragraphs.push(
      `Single-pass wording on this model: ${single.join(' ')} A job thicker than a single-pass figure is a warning on the job check, because the same source does not print a multi-pass maximum.`,
    );
  }
  if (missing.length) {
    paragraphs.push(`Still unpublished, and left blank: ${list(missing)}.`);
  }
  if (m.notes.length) paragraphs.push(`How this page reads the sheet: ${m.notes.join(' ')}`);
  paragraphs.push(
    `Verdict: use the ${m.name} for the processes and outlets above, inside the published thickness, after the job check is run with the breaker size in your panel. Do not use it on a voltage the sheet does not list. The manual that ships with the machine governs setup. The Amazon link on this page searches for "${m.searchQuery}" and does not show a price. Manufacturer page: ${m.productUrl}`,
  );
  return { heading: `Verdict on the ${m.name}`, paragraphs };
}

export function modelSections(m: Model): Section[] {
  return [bestJobs(m), powerNeeds(m), dutyCycle(m), included(m), verdict(m)];
}

function thicknessCompare(a: Model, b: Model, voltage: Volt): string {
  const left = a.voltages.includes(voltage) ? steelMax(a, voltage) : null;
  const right = b.voltages.includes(voltage) ? steelMax(b, voltage) : null;
  if (left == null && right == null) {
    return `At ${voltage} V, neither sheet supplies a mild-steel inch maximum this page can rank.`;
  }
  if (left == null || right == null) {
    const who = left == null ? b : a;
    const value = (left ?? right) as number;
    return `At ${voltage} V, only ${who.name} has a stored mild-steel maximum (${fmtIn(value)}). The other sheet does not, so thickness is not ranked.`;
  }
  if (left === right) {
    return `At ${voltage} V, both stored mild-steel maximums are ${fmtIn(left)}. The tie is that published figure, not a weld this site measured.`;
  }
  const high = left > right ? a : b;
  const low = high === a ? b : a;
  return `At ${voltage} V, ${high.name} publishes the higher mild-steel maximum stored here (${fmtIn(Math.max(left, right))} versus ${fmtIn(Math.min(left, right))} on the ${low.name}).`;
}

function dutyCompare(a: Model, b: Model, voltage: Volt): string {
  const left = dutyMark(a.duty.text, voltage, a.voltages);
  const right = dutyMark(b.duty.text, voltage, b.voltages);
  if (left && right) {
    const sameAmp = left.amps && right.amps && left.amps === right.amps;
    const ampNote =
      left.amps && right.amps && left.amps !== right.amps
        ? 'The amperages differ, so the percents are not the same test point.'
        : sameAmp
          ? `Both first percents are stated at ${left.amps} A.`
          : 'Read each percent next to the amperage in its own clause.';
    return `First ${voltage} V duty percent: ${a.name} is ${left.percent}% (${minutes(left.percent)}), and ${b.name} is ${right.percent}% (${minutes(right.percent)}). ${ampNote}`;
  }
  if (left || right) {
    const who = left ? a : b;
    const mark = (left ?? right)!;
    return `At ${voltage} V, only the ${who.name} duty cell yields a percent for the bar (${mark.percent}%, ${minutes(mark.percent)}).`;
  }
  return `At ${voltage} V, neither duty cell yields a percent for the bar.`;
}

export function pairSections(a: Model, b: Model): Section[] {
  const sharedProcs = a.procs.filter((proc) => b.procs.includes(proc));
  const sharedVolts = a.voltages.filter((voltage) => b.voltages.includes(voltage));
  const onlyProcA = a.procs.filter((proc) => !b.procs.includes(proc));
  const onlyProcB = b.procs.filter((proc) => !a.procs.includes(proc));
  const onlyVoltA = a.voltages.filter((voltage) => !b.voltages.includes(voltage));
  const onlyVoltB = b.voltages.filter((voltage) => !a.voltages.includes(voltage));

  const overlap: string[] = [];
  if (sharedProcs.length) {
    overlap.push(`${a.name} and ${b.name} both publish ${procList(sharedProcs)}.`);
  } else {
    overlap.push(
      `${a.name} and ${b.name} are the same brand. Their process lists do not overlap, so this page compares the published sheets and does not treat them as substitutes.`,
    );
  }
  overlap.push(
    sharedVolts.length
      ? `Both list ${list(sharedVolts.map((voltage) => `${voltage} V`))}.`
      : 'They do not list the same input voltage.',
  );
  if (onlyProcA.length) overlap.push(`Only the ${a.name} publishes ${procList(onlyProcA)}.`);
  if (onlyProcB.length) overlap.push(`Only the ${b.name} publishes ${procList(onlyProcB)}.`);
  if (onlyVoltA.length) overlap.push(`Only the ${a.name} lists ${list(onlyVoltA.map((voltage) => `${voltage} V`))}.`);
  if (onlyVoltB.length) overlap.push(`Only the ${b.name} lists ${list(onlyVoltB.map((voltage) => `${voltage} V`))}.`);
  if (a.acTig !== b.acTig) {
    const withAc = a.acTig ? a : b;
    const without = a.acTig ? b : a;
    overlap.push(`${withAc.name} publishes AC TIG. ${without.name} does not.`);
  }
  for (const voltage of [120, 240] as Volt[]) {
    if (!a.voltages.includes(voltage) && !b.voltages.includes(voltage)) continue;
    overlap.push(thicknessCompare(a, b, voltage));
  }
  overlap.push(`${a.name} thickness cell: ${a.thickness.text}`);
  overlap.push(`${b.name} thickness cell: ${b.thickness.text}`);
  overlap.push(`${a.name} output: ${a.output.text}`);
  overlap.push(`${b.name} output: ${b.output.text}`);

  const power = [
    `${a.name} input: ${a.input.text}`,
    `${b.name} input: ${b.input.text}`,
    circuitSentence(a, 120, 15),
    circuitSentence(b, 120, 15),
    circuitSentence(a, 240, 50),
    circuitSentence(b, 240, 50),
    `Plug lines: ${a.name} is "${plugLine(a.input.text)}", and ${b.name} is "${plugLine(b.input.text)}".`,
  ];

  const duty = [`${a.name} duty cell: ${a.duty.text}`, `${b.name} duty cell: ${b.duty.text}`];
  const dutyVolts = sharedVolts.length ? sharedVolts : ([120, 240] as Volt[]);
  for (const voltage of dutyVolts) duty.push(dutyCompare(a, b, voltage));
  duty.push(
    'A higher percent is not a win when the amperage beside it is lower. This page does not average the two duty cells into one score.',
  );

  const packedA = packageSentences(a);
  const packedB = packageSentences(b);
  const pack = [
    packedA.length
      ? `${a.name} mentions included items in the transcribed fields: ${packedA.join(' ')}`
      : `${a.name}: the transcribed fields do not list carton contents.`,
    packedB.length
      ? `${b.name} mentions included items in the transcribed fields: ${packedB.join(' ')}`
      : `${b.name}: the transcribed fields do not list carton contents.`,
    `Weight cells: ${a.name}: ${a.weight.text} ${b.name}: ${b.weight.text}`,
    `Wire or rod cells: ${a.name}: ${a.wire.text} ${b.name}: ${b.wire.text}`,
  ];

  const verdictLines: string[] = [
    'A blank on one model is not filled from the other model. Nothing below is a lab test or a price.',
  ];
  if (a.voltages.includes(120) !== b.voltages.includes(120)) {
    const on120 = a.voltages.includes(120) ? a : b;
    const other = on120 === a ? b : a;
    verdictLines.push(`Pick the ${on120.name} when the only outlet is 120 V. The ${other.name} does not list 120 V.`);
  }
  if (a.voltages.includes(240) !== b.voltages.includes(240)) {
    const on240 = a.voltages.includes(240) ? a : b;
    const other = on240 === a ? b : a;
    verdictLines.push(`Pick the ${on240.name} when the outlet is 240 V class. The ${other.name} does not list that input.`);
  }
  for (const voltage of sharedVolts) {
    const left = steelMax(a, voltage);
    const right = steelMax(b, voltage);
    if (left != null && right != null && left !== right) {
      const high = left > right ? a : b;
      const low = high === a ? b : a;
      verdictLines.push(
        `For mild steel at ${voltage} V, the ${high.name} publishes the higher maximum stored here (${fmtIn(Math.max(left, right))} versus ${fmtIn(Math.min(left, right))} on the ${low.name}). Stay inside a single-pass note when the source used those words.`,
      );
    }
  }
  if (a.weightLb != null && b.weightLb != null && a.weightLb !== b.weightLb) {
    const light = a.weightLb < b.weightLb ? a : b;
    const heavy = light === a ? b : a;
    verdictLines.push(`The ${light.name} is the lighter published weight (${light.weightLb} lb versus ${heavy.weightLb} lb on the ${heavy.name}).`);
  }
  const chip120a = outletCircuit(a, 120, 15);
  const chip120b = outletCircuit(b, 120, 15);
  if (chip120a !== chip120b) {
    verdictLines.push(`On a 120 V / 15 A chip, the ${a.name} is ${labelStatus(chip120a)} and the ${b.name} is ${labelStatus(chip120b)}.`);
  }
  const chip240a = outletCircuit(a, 240, 50);
  const chip240b = outletCircuit(b, 240, 50);
  if (chip240a !== chip240b) {
    verdictLines.push(`On a 240 V / 50 A chip, the ${a.name} is ${labelStatus(chip240a)} and the ${b.name} is ${labelStatus(chip240b)}.`);
  }
  if (onlyProcA.length || onlyProcB.length) {
    verdictLines.push(
      `Process coverage is not equal. ${a.name} publishes ${procList(a.procs)}. ${b.name} publishes ${procList(b.procs)}. Choose the machine whose sheet names the process you will run.`,
    );
  }
  verdictLines.push(
    `Verdict: neither name is a general winner. Match the outlet you have, the process the sheet names, and the thickness that sheet prints, then run the job check with your breaker. Amazon links stay on the model pages. They are searches, and this comparison does not show a price.`,
  );

  return [
    { heading: `Best jobs: ${a.name} and ${b.name}`, paragraphs: overlap },
    { heading: 'Power needs compared', paragraphs: power },
    { heading: 'Duty cycle compared', paragraphs: duty },
    { heading: 'What the sheets say is included', paragraphs: pack },
    { heading: `Verdict: ${a.name} or ${b.name}`, paragraphs: verdictLines },
  ];
}

export function brandSections(name: string, list: Model[]): Section[] {
  const procs = [...new Set(list.flatMap((model) => model.procs))];
  const volts = [...new Set(list.flatMap((model) => model.voltages))].sort((a, b) => a - b);
  const pass15 = list.filter((model) => outletCircuit(model, 120, 15) !== 'fail').map((model) => model.name);
  const pass50 = list.filter((model) => outletCircuit(model, 240, 50) !== 'fail').map((model) => model.name);
  const intro = [
    `${name} on this site is ${list.length === 1 ? 'one model' : `${list.length} models`}: ${list.map((model) => model.name).join(', ')}.`,
    `Processes named on at least one cited ${name} page: ${procList(procs)}. Input classes that appear: ${volts.map((voltage) => `${voltage} V`).join(' and ')}.`,
    `Each model page carries the source URL on every spec row. This brand page does not average those sheets and does not rank the line by a score.`,
    `Models that do not fail the 120 V / 15 A chip: ${pass15.length ? pass15.join(', ') : 'none'}. Models that do not fail the 240 V / 50 A chip: ${pass50.length ? pass50.join(', ') : 'none'}. A fail means the published circuit data does not fit that outlet, or the voltage is not on the sheet. A warning stays in the "does not fail" group because the chip hides fails only.`,
  ];
  const perModel = list.map((model) => {
    const duty = model.duty.published ? model.duty.text : 'Duty cycle is not published.';
    const thick = model.thickness.published ? model.thickness.text : 'Thickness is not published.';
    const wire = model.wire.published ? model.wire.text : 'Wire or rod size is not published.';
    return `${model.name}: ${model.summary} Input: ${model.input.text} Duty: ${duty} Thickness: ${thick} Wire or rod: ${wire}`;
  });
  const sections: Section[] = [
    { heading: `${name} models on this site`, paragraphs: intro },
    { heading: `Published figures for each ${name} model`, paragraphs: perModel },
  ];
  if (list.length >= 2 && list.length <= 4) {
    for (let i = 0; i < list.length; i++) {
      for (let j = i + 1; j < list.length; j++) {
        const pair = pairSections(list[i], list[j]);
        sections.push({
          heading: `${list[i].name} and ${list[j].name}`,
          paragraphs: pair[pair.length - 1].paragraphs,
        });
      }
    }
  }
  return sections;
}
