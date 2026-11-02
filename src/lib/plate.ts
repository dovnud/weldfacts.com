import type { Model, Volt } from '../data/models';
import { evaluateJob, type CheckStatus } from './job.ts';

export const OUTLETS = [
  { id: '120-15', voltage: 120 as Volt, breakerA: 15, label: '120V/15A' },
  { id: '240-50', voltage: 240 as Volt, breakerA: 50, label: '240V/50A' },
] as const;

export type OutletId = (typeof OUTLETS)[number]['id'];

const RANK: Record<CheckStatus, number> = { pass: 3, warn: 2, na: 1, fail: 0 };

/** Best published circuit result for this outlet. Voltage miss is a fail. */
export function outletCircuit(model: Model, voltage: Volt, breakerA: number): CheckStatus {
  if (!model.voltages.includes(voltage)) return 'fail';
  let best: CheckStatus | null = null;
  for (const process of model.procs) {
    const check = evaluateJob(model, {
      voltage,
      breakerA,
      material: 'mild-steel',
      thicknessIn: 0.125,
      process,
    }).checks.find((c) => c.id === 'circuit');
    if (!check || check.status === 'na') continue;
    if (best == null || RANK[check.status] > RANK[best]) best = check.status;
  }
  return best ?? 'na';
}

export function fitTokens(model: Model): string {
  return OUTLETS.filter((o) => outletCircuit(model, o.voltage, o.breakerA) !== 'fail')
    .map((o) => o.id)
    .join(' ');
}

export type DutyMark = {
  percent: number;
  amps: string | null;
  clause: string;
  /** False when the duty sentence does not name a voltage. */
  split: boolean;
};

function mentions(clause: string, voltage: Volt): boolean {
  if (voltage === 120) return /\b(120|115|110)\s*V/i.test(clause);
  return /\b(240|230|220|208)\s*V/i.test(clause);
}

function anyVoltage(clause: string): boolean {
  return /\b\d{2,3}\s*V/i.test(clause);
}

/** First published duty percent for this outlet, read from the duty sentence. No new number. */
export function dutyMark(text: string, voltage: Volt, voltages: Volt[]): DutyMark | null {
  if (!text || text.startsWith('Not published')) return null;
  const clauses = text
    .split(/(?<=[.;])\s+/)
    .map((c) => c.trim())
    .filter(Boolean);
  const matched = clauses.filter((c) => mentions(c, voltage));
  const unscoped = !clauses.some(anyVoltage);
  const pool = matched.length ? matched : unscoped && voltages.includes(voltage) ? clauses : [];
  for (const clause of pool) {
    const pct = clause.match(/(\d+(?:\.\d+)?)\s*%/);
    if (!pct) continue;
    const before = clause.slice(0, pct.index);
    const amp = before.match(/(\d+(?:\.\d+)?)\s*A\b/gi);
    const last = amp ? amp[amp.length - 1].replace(/\s*A/i, '') : null;
    return { percent: Number(pct[1]), amps: last, clause, split: matched.length > 0 };
  }
  return null;
}

export function plugLine(input: string): string {
  if (!input || input.startsWith('Not published')) return 'Plug not printed';
  const nema = input.match(/NEMA\s*[0-9]{1,2}-[0-9]{1,2}P?/i);
  if (nema) return nema[0].replace(/\s+/g, ' ');
  const mvp = input.match(/\d-\d+P(?:\s*\([^)]+\))?/g);
  if (mvp && mvp.length) return mvp.join(', ');
  if (/plug/i.test(input)) return 'Plug named, type not printed';
  return 'Plug not printed';
}

export const PROC_LABEL: Record<string, string> = {
  mig: 'MIG',
  flux: 'FCAW',
  stick: 'STICK',
  tig: 'TIG',
};
