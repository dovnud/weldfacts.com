import { getModel, models, pairs } from '../src/data/models.ts';
import { modelBlocks } from '../src/lib/guide.ts';
import { evaluateJob } from '../src/lib/job.ts';
import { dutyMark, fitTokens } from '../src/lib/plate.ts';

function status(slug, input, id) {
  return evaluateJob(getModel(slug), input).checks.find((c) => c.id === id)?.status;
}
function bucket(slug, input) {
  return evaluateJob(getModel(slug), input).bucket;
}

const thin = { voltage: 120, breakerA: 15, material: 'mild-steel', thicknessIn: 0.125, process: 'mig' };
if (status('handler-210i', thin, 'circuit') !== 'pass') throw new Error('210i 15A row should pass');
if (status('handler-210i', thin, 'thickness') !== 'pass') throw new Error('1/8 in is inside the 210i single-pass max');
if (bucket('handler-210i', thin) !== 'fit') throw new Error('210i 15A 1/8 mig should fit');

const thick = { ...thin, thicknessIn: 0.5 };
if (status('handler-210i', thick, 'thickness') !== 'warn') throw new Error('past single-pass max is a warning');
if (bucket('handler-210i', thick) !== 'partial') throw new Error('single-pass warning is partial');

const stickShort = { voltage: 120, breakerA: 20, material: 'mild-steel', thicknessIn: 0.25, process: 'stick' };
if (status('thunderbolt-210-mv', stickShort, 'thickness') !== 'fail') throw new Error('Thunderbolt 120 V max is 1/8');
if (status('thunderbolt-210-mv', stickShort, 'circuit') !== 'fail') throw new Error('27.8 A input does not fit a 20 A breaker');
if (bucket('thunderbolt-210-mv', stickShort) !== 'out') throw new Error('Thunderbolt short circuit is out');

const stick240 = { voltage: 240, breakerA: 50, material: 'mild-steel', thicknessIn: 0.25, process: 'stick' };
if (status('thunderbolt-210-mv', stick240, 'thickness') !== 'pass') throw new Error('1/4 in is inside the 240 V 1/2 in max');
if (status('thunderbolt-210-mv', stick240, 'circuit') !== 'warn') throw new Error('draw under the breaker without a named breaker is a warning');

if (status('multimatic-235', thin, 'voltage') !== 'fail') throw new Error('Multimatic 235 is 240 V only');
if (bucket('multimatic-235', { ...thin, voltage: 120 }) !== 'out') throw new Error('235 on 120 V is out');

const mm142 = { voltage: 120, breakerA: 20, material: 'mild-steel', thicknessIn: 0.125, process: 'mig' };
if (bucket('millermatic-142', mm142) !== 'fit') throw new Error('142 on a 20 A circuit at 1/8 should fit');
if (status('millermatic-142', { ...mm142, breakerA: 15 }, 'circuit') !== 'fail') throw new Error('142 publishes a 20 A input');
if (status('millermatic-142', { ...mm142, thicknessIn: 0.25 }, 'thickness') !== 'warn') throw new Error('142 steel max is single pass 3/16');

const rebel = { voltage: 120, breakerA: 30, material: 'mild-steel', thicknessIn: 0.125, process: 'mig' };
if (status('rebel-emp-215ic', rebel, 'circuit') !== 'pass') throw new Error('215ic 30 A should use the 20 A row inside the 30 A fuse max');
if (bucket('rebel-emp-215ic', rebel) !== 'partial') throw new Error('215ic has no plate thickness, so the match is partial');
if (status('rebel-emp-215ic', { ...rebel, breakerA: 60 }, 'circuit') !== 'fail') throw new Error('60 A is above the 50 A normal fuse');

if (status('maxstar-161-sth', { voltage: 240, breakerA: 30, material: 'aluminum', thicknessIn: 0.125, process: 'tig' }, 'material') !== 'fail') {
  throw new Error('DC TIG that does not name aluminum fails aluminum');
}
if (status('dynasty-210', { voltage: 240, breakerA: 30, material: 'aluminum', thicknessIn: 0.125, process: 'tig' }, 'material') !== 'pass') {
  throw new Error('Dynasty names aluminum');
}
if (bucket('dynasty-210', { voltage: 240, breakerA: 30, material: 'aluminum', thicknessIn: 0.125, process: 'tig' }) !== 'partial') {
  throw new Error('Dynasty has no input amps or thickness number');
}

if (status('power-mig-260', { voltage: 120, breakerA: 50, material: 'aluminum', thicknessIn: 0.125, process: 'mig' }, 'voltage') !== 'fail') {
  throw new Error('Power MIG 260 is not 120 V');
}
if (status('power-mig-260', { voltage: 240, breakerA: 50, material: 'aluminum', thicknessIn: 0.125, process: 'mig' }, 'circuit') !== 'fail') {
  throw new Error('55 A at 230 V does not fit a 50 A breaker');
}
if (status('handler-125', { voltage: 120, breakerA: 20, material: 'mild-steel', thicknessIn: 0.125, process: 'flux' }, 'circuit') !== 'fail') {
  throw new Error('Handler 125 draws 21.3 A');
}

const m211 = getModel('millermatic-211-pro');
const d120 = dutyMark(m211.duty.text, 120, m211.voltages);
const d240 = dutyMark(m211.duty.text, 240, m211.voltages);
if (d120?.percent !== 60 || d120?.amps !== '110') throw new Error('211 PRO 120 V duty should be 60% at 110 A');
if (d240?.percent !== 60 || d240?.amps !== '160') throw new Error('211 PRO 240 V duty should be 60% at 160 A');
const pm260 = getModel('power-mig-260');
if (dutyMark(pm260.duty.text, 120, pm260.voltages)) throw new Error('260 has no 120 V duty');
if (dutyMark(pm260.duty.text, 240, pm260.voltages)?.percent !== 40) throw new Error('260 duty is 40%');
const fit210 = fitTokens(getModel('handler-210i'));
if (!fit210.includes('120-15') || !fit210.includes('240-50')) throw new Error('210i should stay on both chips');
if (fitTokens(getModel('millermatic-142')).includes('120-15')) throw new Error('142 needs 20 A, so 15 A fails');
if (!fitTokens(getModel('thunderbolt-210-mv')).includes('240-50')) throw new Error('Thunderbolt 44.9 A fits a 50 A breaker as a warning');

const published = pairs();
if (published.length < 10 || published.length > 40) throw new Error(`unexpected pair count ${published.length}`);
for (const pair of published) {
  const shareP = pair.a.procs.some((p) => pair.b.procs.includes(p));
  const shareV = pair.a.voltages.some((v) => pair.b.voltages.includes(v));
  if (!shareP || !shareV) throw new Error(`${pair.slug} is not a useful pair`);
}
for (const model of models) {
  const text = modelBlocks(model).flatMap((block) => block.paragraphs).join(' ');
  if (text.split(/\s+/).length < 180) throw new Error(`${model.slug} guide is short`);
  if (/—|actually|honestly|\bhonest\b|editorial team/i.test(text)) throw new Error(`${model.slug} guide has a banned tell`);
}

console.log('job tests ok');
