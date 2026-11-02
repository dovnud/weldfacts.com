import type { Draw, Metal, Model, Proc } from '../data/models';

export type JobInput = {
  voltage: 120 | 240;
  breakerA: number;
  material: Metal;
  thicknessIn: number;
  process: Proc;
};

export type CheckStatus = 'pass' | 'fail' | 'warn' | 'na';

export type JobCheck = {
  id: string;
  title: string;
  status: CheckStatus;
  detail: string;
};

export type JobBucket = 'fit' | 'partial' | 'out';

export type JobResult = {
  checks: JobCheck[];
  headline: string;
  bucket: JobBucket;
};

function inches(n: number): string {
  return (Math.round(n * 1000) / 1000).toString();
}

function fuseStatus(row: Draw, breakerA: number): CheckStatus | 'skip' {
  if (row.maxTimeDelayA == null && row.maxNormalFuseA == null) return 'skip';
  const hard = row.maxNormalFuseA ?? row.maxTimeDelayA;
  if (hard != null && breakerA > hard) return 'fail';
  if (row.maxTimeDelayA != null && breakerA > row.maxTimeDelayA) return 'warn';
  return 'pass';
}

function worse(a: CheckStatus, b: CheckStatus): CheckStatus {
  const rank: Record<CheckStatus, number> = { pass: 0, na: 1, warn: 2, fail: 3 };
  return rank[a] >= rank[b] ? a : b;
}

function circuitCheck(model: Model, input: JobInput, voltageOk: boolean): JobCheck {
  if (!voltageOk) {
    return {
      id: 'circuit',
      title: 'Published input current',
      status: 'na',
      detail: 'Input current is not compared when this outlet voltage is outside the published input.',
    };
  }
  const specific = model.draws.filter((d) => d.voltage === input.voltage && d.process === input.process);
  const generic = model.draws.filter((d) => d.voltage === input.voltage && !d.process);
  const rows = specific.length ? specific : generic;
  if (!rows.length) {
    return {
      id: 'circuit',
      title: 'Published input current',
      status: 'na',
      detail: `${model.input.text} No input-ampere figure is printed for ${input.voltage} V, so the breaker is not scored.`,
    };
  }

  const labeled = rows.filter((d) => d.onBreakerA != null);
  if (labeled.length) {
    const eligible = labeled.filter((d) => (d.onBreakerA as number) <= input.breakerA);
    if (!eligible.length) {
      const smallest = Math.min(...labeled.map((d) => d.onBreakerA as number));
      return {
        id: 'circuit',
        title: 'Published circuit size',
        status: 'fail',
        detail: `The smallest ${input.voltage} V breaker this sheet rates is ${smallest} A. Entered breaker: ${input.breakerA} A. ${model.input.text}`,
      };
    }
    const row = eligible.sort((a, b) => (b.onBreakerA as number) - (a.onBreakerA as number))[0];
    let status: CheckStatus = 'pass';
    const bits = [`The check uses the published ${row.onBreakerA} A circuit row at ${input.voltage} V.`];
    if (row.inputA != null && row.inputA > input.breakerA) {
      status = 'warn';
      bits.push(`That row prints ${row.inputA} A input at rated output, which is above the ${input.breakerA} A breaker entered.`);
    } else if (row.inputA != null) {
      bits.push(`Input current at rated output on that row is ${row.inputA} A.`);
    }
    const fuse = fuseStatus(row, input.breakerA);
    if (fuse === 'fail' || fuse === 'warn') status = worse(status, fuse);
    if (row.maxTimeDelayA != null) bits.push(`The same source’s maximum time-delay fuse or breaker is ${row.maxTimeDelayA} A.`);
    if (row.maxNormalFuseA != null) bits.push(`Its maximum normal fuse is ${row.maxNormalFuseA} A.`);
    bits.push(model.input.text);
    return { id: 'circuit', title: 'Published circuit size', status, detail: bits.join(' ') };
  }

  const amps = rows.map((r) => r.inputA).filter((n): n is number => n != null);
  if (!amps.length) {
    return { id: 'circuit', title: 'Published input current', status: 'na', detail: model.input.text };
  }
  const max = Math.max(...amps);
  const min = Math.min(...amps);
  let status: CheckStatus = input.breakerA < min ? 'fail' : 'warn';
  if (input.breakerA >= min && input.breakerA < max) status = 'warn';
  const fuse = fuseStatus(rows[0], input.breakerA);
  if (fuse === 'fail' || fuse === 'warn') status = worse(status, fuse);
  const span = min === max ? `${max} A` : `${min}–${max} A`;
  const verdict =
    status === 'fail'
      ? 'The published input current is above the breaker entered.'
      : 'The published input current fits under the breaker number. The sheet does not name a breaker size, so this is not a pass.';
  return {
    id: 'circuit',
    title: 'Published input current',
    status,
    detail: `Published input current at rated output is ${span} at ${input.voltage} V${rows[0].process ? ` for ${rows[0].process}` : ''}. Entered breaker: ${input.breakerA} A. ${verdict} ${model.input.text}`,
  };
}

function processCheck(model: Model, input: JobInput): JobCheck {
  const ok = model.procs.includes(input.process);
  return {
    id: 'process',
    title: 'Published process',
    status: ok ? 'pass' : 'fail',
    detail: ok
      ? `${model.processes.text}`
      : `${model.name} does not publish ${input.process} in the processes we cited. ${model.processes.text}`,
  };
}

function materialCheck(model: Model, input: JobInput): JobCheck {
  if (input.material === 'aluminum' && input.process === 'tig' && !model.namedMetals.includes('aluminum')) {
    return {
      id: 'material',
      title: 'Published metal',
      status: 'fail',
      detail: model.acTig
        ? `${model.name} publishes AC TIG, and the cited page does not name aluminum. Aluminum is not scored as a pass.`
        : `${model.name} does not name aluminum, and the cited TIG process is not published as AC. DC TIG is not treated as an aluminum process.`,
    };
  }
  if (model.namedMetals.includes(input.material)) {
    return {
      id: 'material',
      title: 'Published metal',
      status: 'pass',
      detail: `The cited page names ${input.material.replace('-', ' ')}.`,
    };
  }
  return {
    id: 'material',
    title: 'Published metal',
    status: 'na',
    detail: `The cited page does not name ${input.material.replace('-', ' ')} as a weld metal. That metal is not scored as a pass or a fail.`,
  };
}

function thicknessCheck(model: Model, input: JobInput): JobCheck {
  const caps = model.caps.filter(
    (c) =>
      c.process === input.process &&
      (c.voltage == null || c.voltage === input.voltage) &&
      (c.metals.length === 0 || c.metals.includes(input.material)) &&
      c.maxIn != null,
  );
  if (!caps.length) {
    return {
      id: 'thickness',
      title: 'Published thickness',
      status: 'na',
      detail: `${model.thickness.text} No numeric maximum on the cited page matches this process, voltage, and metal, so thickness is not scored.`,
    };
  }
  const specific = caps.filter((c) => c.voltage === input.voltage);
  const pool = specific.length ? specific : caps.filter((c) => c.voltage == null);
  const cap = pool.reduce((a, b) => ((a.maxIn as number) <= (b.maxIn as number) ? a : b));
  const max = cap.maxIn as number;
  if (input.thicknessIn <= max) {
    return {
      id: 'thickness',
      title: 'Published thickness',
      status: 'pass',
      detail: `Entered ${inches(input.thicknessIn)} in is within the published maximum of ${inches(max)} in. ${cap.text}`,
    };
  }
  if (cap.singlePass) {
    return {
      id: 'thickness',
      title: 'Published thickness',
      status: 'warn',
      detail: `Entered ${inches(input.thicknessIn)} in is above the published single-pass figure of ${inches(max)} in. The same source does not print a multi-pass maximum. ${cap.text}`,
    };
  }
  return {
    id: 'thickness',
    title: 'Published thickness',
    status: 'fail',
    detail: `Entered ${inches(input.thicknessIn)} in is above the published maximum of ${inches(max)} in. ${cap.text}`,
  };
}

export function evaluateJob(model: Model, input: JobInput): JobResult {
  const voltageOk = model.voltages.includes(input.voltage);
  const checks: JobCheck[] = [
    {
      id: 'voltage',
      title: 'Published input voltage',
      status: voltageOk ? 'pass' : 'fail',
      detail: voltageOk
        ? `${model.input.text}`
        : `${model.name} does not publish ${input.voltage} V input. ${model.input.text}`,
    },
    circuitCheck(model, input, voltageOk),
    processCheck(model, input),
    materialCheck(model, input),
    thicknessCheck(model, input),
  ];
  const fails = checks.filter((c) => c.status === 'fail').length;
  const soft = checks.some((c) => c.status === 'warn' || c.status === 'na');
  const bucket: JobBucket = fails ? 'out' : soft ? 'partial' : 'fit';
  const headline = fails
    ? `${fails} published check${fails === 1 ? '' : 's'} do not pass.`
    : bucket === 'partial'
      ? 'Some published checks pass. A figure is missing, or the sheet only partly covers this outlet.'
      : 'The published checks pass for the outlet and the job entered.';
  return { checks, headline, bucket };
}

export function rankJobs(models: Model[], input: JobInput): { fit: Model[]; partial: Model[]; out: Model[] } {
  const groups: Record<JobBucket, Model[]> = { fit: [], partial: [], out: [] };
  for (const model of models) groups[evaluateJob(model, input).bucket].push(model);
  const byName = (a: Model, b: Model) => a.name.localeCompare(b.name);
  const byWeight = (a: Model, b: Model) => {
    if (a.weightLb == null && b.weightLb == null) return byName(a, b);
    if (a.weightLb == null) return 1;
    if (b.weightLb == null) return -1;
    return a.weightLb - b.weightLb || byName(a, b);
  };
  groups.fit.sort(byWeight);
  groups.partial.sort(byWeight);
  groups.out.sort(byName);
  return groups;
}
