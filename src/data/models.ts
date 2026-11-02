import { PUBLISHED_PAIRS } from './publishedPairs.ts';

/**
 * Manufacturer specs read on 2 November 2026.
 * A number appears here only when the cited page stated it.
 * "Not published by manufacturer" means that page did not state the field.
 */

export const CHECKED = '2026-11-02';

export type Cite = { url: string; where: string };

export type Field = {
  text: string;
  published: boolean;
  cite: Cite;
};

export type Proc = 'mig' | 'flux' | 'stick' | 'tig';
export type Metal = 'mild-steel' | 'stainless' | 'aluminum' | 'cast-iron';
export type Volt = 120 | 240;

export type Cap = {
  process: Proc;
  metals: Metal[];
  voltage?: Volt;
  maxIn?: number;
  /** The cited maximum is a single-pass figure and the same source gives no multi-pass maximum. */
  singlePass?: boolean;
  text: string;
};

export type Draw = {
  voltage: Volt;
  process?: Proc;
  /** Breaker size the sheet names for this row. */
  onBreakerA?: number;
  /** Input current at rated output, amperes. */
  inputA?: number;
  maxTimeDelayA?: number;
  maxNormalFuseA?: number;
};

export type Model = {
  slug: string;
  brand: string;
  brandSlug: string;
  name: string;
  sku?: string;
  processes: Field;
  output: Field;
  duty: Field;
  input: Field;
  wire: Field;
  weight: Field;
  thickness: Field;
  procs: Proc[];
  /** Metals the cited page names. Absence is not treated as an exclusive list. */
  namedMetals: Metal[];
  /** True when the cited page publishes AC TIG. */
  acTig: boolean;
  voltages: Volt[];
  draws: Draw[];
  caps: Cap[];
  /** A single published machine weight in pounds, when the page prints one. */
  weightLb?: number;
  productUrl: string;
  searchQuery: string;
  summary: string;
  notes: string[];
};

function field(text: string, url: string, where: string, published = true): Field {
  return { text, published, cite: { url, where } };
}

function missing(url: string, where: string): Field {
  return field('Not published by manufacturer', url, where, false);
}

const MM142S = 'https://contenthub.itwwelding.com/api/public/content/miller-electric-mfg-llc/spec-sheet/PIM/4877d6-dc12-41.pdf';
const MM142P = 'https://www.millerwelds.com/en-us/equipment/welders/mig-gmaw/millermatic/millermatic-142-m90601/millermatic-142-907838';
const MM211S = 'https://contenthub.itwwelding.com/api/public/content/miller-electric-mfg-llc/spec-sheet/PIM/09c6b7-dc12-61.pdf';
const MM211P = 'https://www.millerwelds.com/en-us/equipment/welders/mig-gmaw/millermatic/millermatic-211-pro-m00207/millermatic-211-pro-907839';
const MM252S = 'https://contenthub.itwwelding.com/api/public/content/miller-electric-mfg-llc/spec-sheet/PIM/9022a4-dc12-49.pdf';
const MM252P = 'https://www.millerwelds.com/en-us/equipment/welders/mig-gmaw/millermatic/millermatic-252-m00218/millermatic-252-907321';
const MM255S = 'https://contenthub.itwwelding.com/api/public/content/miller-electric-mfg-llc/spec-sheet/PIM/94739d-dc12-8.pdf';
const MM255P = 'https://www.millerwelds.com/en-us/equipment/welders/mig-gmaw/millermatic/millermatic-255-m30174/millermatic-255-907734';
const M215S = 'https://contenthub.itwwelding.com/api/public/content/miller-electric-mfg-llc/spec-sheet/PIM/4b92ec-dc13-5.pdf';
const M215P = 'https://www.millerwelds.com/en-us/equipment/welders/multiprocess/multimatic/multimatic-215-pro-m30091/multimatic-215-pro-907840';
const M220S = 'https://contenthub.itwwelding.com/api/public/content/miller-electric-mfg-llc/spec-sheet/PIM/abe38a-ad9-0.pdf';
const M220P = 'https://www.millerwelds.com/en-us/equipment/welders/multiprocess/multimatic/multimatic-220-ac-dc-m30190/multimatic-220-ac-dc-907757';
const M235S = 'https://contenthub.itwwelding.com/api/public/content/miller-electric-mfg-llc/spec-sheet/PIM/d634a8-dc14-0.pdf';
const M235P = 'https://www.millerwelds.com/en-us/equipment/welders/multiprocess/multimatic/multimatic-235-m30250/multimatic-235-907780';
const M255S = 'https://contenthub.itwwelding.com/api/public/content/miller-electric-mfg-llc/spec-sheet/PIM/cf7075-dc12-9.pdf';
const M255P = 'https://www.millerwelds.com/en-us/equipment/welders/multiprocess/multimatic/multimatic-255-m30175/multimatic-255-907728';
const TB210S = 'https://contenthub.itwwelding.com/api/public/content/miller-electric-mfg-llc/spec-sheet/PIM/91ef29-dc37-1.pdf';
const TB210P = 'https://www.millerwelds.com/en-us/equipment/welders/stick-smaw/thunderbolt-210-mv-m90619/thunderbolt-210-mv-stick-welder-907909';
const MX161S = 'https://contenthub.itwwelding.com/api/public/content/miller-electric-mfg-llc/spec-sheet/PIM/787461-dc27-5.pdf';
const MX161P = 'https://www.millerwelds.com/en-us/equipment/welders/tig-gtaw/maxstar/maxstar-161-m30132/maxstar-161-sth-907711';
const SW212S = 'https://contenthub.itwwelding.com/api/public/content/miller-electric-mfg-llc/spec-sheet/PIM/26bae1-ad4-7.pdf';
const SW212P = 'https://www.millerwelds.com/en-us/equipment/welders/tig-gtaw/syncrowave/syncrowave-212-m00205/syncrowave-212-air-cooled-package-907911';
const DY210S = 'https://contenthub.itwwelding.com/api/public/content/miller-electric-mfg-llc/spec-sheet/PIM/3d6486-ad4-81.pdf';
const DY210P = 'https://www.millerwelds.com/en-us/equipment/welders/tig-gtaw/dynasty/dynasty-210-m30020/dynasty-210-907816';
const H125S = 'https://contenthub.itwwelding.com/api/public/content/hobart-welding-products/spec-sheet/PIM/8eeff3-handler-125-284611.pdf';
const H125P = 'https://www.hobartwelders.com/en-us/equipment/welders/mig-gmaw/handler/handler-125-mig-welder-m00211/handler-125-500573';
const H140S = 'https://contenthub.itwwelding.com/api/public/content/hobart-welding-products/spec-sheet/PIM/7259b4-handler-140ez-299171.pdf';
const H140P = 'https://www.hobartwelders.com/en-us/equipment/welders/mig-gmaw/handler/handler-140ez-mig-welder-m00167/handler-140ez-500582';
const H210S = 'https://contenthub.itwwelding.com/api/public/content/hobart-welding-products/spec-sheet/PIM/fb062c-handler-210mvp-250822.pdf';
const H210P = 'https://www.hobartwelders.com/en-us/equipment/welders/mig-gmaw/handler/handler-210mvp-mig-welder-m00229/handler-210mvp-500553';
const H210IS = 'https://contenthub.itwwelding.com/api/public/content/hobart-welding-products/spec-sheet/PIM/8c8276-handler-210i-403313.pdf';
const H210IP = 'https://www.hobartwelders.com/en-us/equipment/welders/mig-gmaw/handler/handler-210i-m90554/handler-210i-500588';
const IM240S = 'https://contenthub.itwwelding.com/api/public/content/hobart-welding-products/spec-sheet/PIM/a43585-ironman-240-287788.pdf';
const IM240P = 'https://www.hobartwelders.com/en-us/equipment/welders/mig-gmaw/ironman/ironman-240-mig-welder-m30243/ironman-240-500574';
const MH200S = 'https://contenthub.itwwelding.com/api/public/content/hobart-welding-products/spec-sheet/PIM/b8940e-multi-handler-200-287909.pdf';
const MH200P = 'https://www.hobartwelders.com/en-us/equipment/welders/multiprocess/multi-handler-200-m30242/multi-handler-200-500578';
const L215 = 'https://ch-delivery.lincolnelectric.com/api/public/content/fc24a30abf0d42d8af81476372a4a97a';
const L200 = 'https://ch-delivery.lincolnelectric.com/api/public/content/9ebae66c8f4b4362b6d2aa943af999cc';
const L260 = 'https://ch-delivery.lincolnelectric.com/api/public/content/36c2a1178b884ba3b0365128a348f4c0?v=1a00dbe8';
const L210 = 'https://ch-delivery.lincolnelectric.com/api/public/content/225c3bec0eb44862b580e3966767b3cb?v=c094987b';
const E215 = 'https://ldgsesabwe.blob.core.windows.net/instructionmanuals/0463%20789%20001%20US.pdf';
const E235 = 'https://assets.esab.com/assetbank-esab/assetfile/21203';
const P225 = 'https://primeweld.com/products/tig-225x-ac-dc-tig-welder';
const P325 = 'https://primeweld.com/products/primeweld-tig-325x';
const P230 = 'https://primeweld.com/products/tig230-ac-dc-tig-welder-with-pulse';
const P285 = 'https://primeweld.com/products/primeweld-mig-285';
const P200 = 'https://primeweld.com/products/tig200-dc-inverter-tig-welder';
const HF200 = 'https://manuals.harborfreight.com/manuals/57000-57999/57862-193175459367.pdf';
const HF140 = 'https://manuals.harborfreight.com/manuals/58000-58999/58828-193175447272.pdf';

export const models: Model[] = [
  {
    slug: 'millermatic-142',
    brand: 'Miller',
    brandSlug: 'miller',
    name: 'Millermatic 142',
    sku: '907838',
    procs: ['mig', 'flux'],
    namedMetals: ['mild-steel', 'aluminum'],
    acTig: false,
    voltages: [120],
    weightLb: 33,
    draws: [{ voltage: 120, onBreakerA: 20 }],
    caps: [
      { process: 'mig', metals: ['mild-steel'], voltage: 120, maxIn: 0.1875, singlePass: true, text: 'Quick specs: steel 24 ga.–3/16 in. single pass.' },
      { process: 'flux', metals: ['mild-steel'], voltage: 120, maxIn: 0.1875, singlePass: true, text: 'Quick specs: steel 24 ga.–3/16 in. single pass. The sheet does not give flux-cored a separate thickness.' },
    ],
    processes: field('MIG (GMAW) and flux-cored (FCAW).', MM142S, 'Quick specs, Processes'),
    output: field('30–140 A.', MM142P, 'Product page specifications, Amperage Range'),
    duty: field('100 A at 19 V, 60% duty cycle. 80 A at 18 V, 100% duty cycle.', MM142S, 'Quick specs, Rated Output'),
    input: field('120 V, 20 A, single-phase, 50/60 Hz.', MM142S, 'Quick specs, Input Power'),
    wire: field('Set up for .024–.035 in. (0.6–0.9 mm) solid wire and .030–.045 in. (0.8–1.2 mm) flux-cored wire. Uses 4- or 8-inch spools.', MM142S, 'Feature paragraph under the quick specs'),
    weight: field('33 lb.', MM142S, 'Specifications table, net weight, and the quick-spec weight callout'),
    thickness: field('Steel: 24 ga.–3/16 in. single pass. Aluminum: 18–14 ga. single pass.', MM142S, 'Quick specs, Weld Thickness'),
    productUrl: MM142P,
    searchQuery: 'Miller Millermatic 142 welder',
    summary: '120 V MIG and flux-cored welder. Miller publishes 30–140 A, 100 A at 19 V and 60% duty cycle, and a 20 A input.',
    notes: ['Aluminum thickness is printed as 18–14 gauge, not as an inch maximum, so the job check does not convert that gauge.'],
  },
  {
    slug: 'millermatic-211-pro',
    brand: 'Miller',
    brandSlug: 'miller',
    name: 'Millermatic 211 PRO',
    sku: '907839',
    procs: ['mig', 'flux'],
    namedMetals: ['mild-steel', 'aluminum'],
    acTig: false,
    voltages: [120, 240],
    weightLb: 35,
    draws: [
      { voltage: 120, inputA: 27 },
      { voltage: 240, inputA: 28.9 },
    ],
    caps: [
      { process: 'mig', metals: ['mild-steel'], voltage: 120, maxIn: 0.1875, text: 'Quick specs, 120 V steel: 24 ga.–3/16 in.' },
      { process: 'mig', metals: ['mild-steel'], voltage: 240, maxIn: 0.375, text: 'Quick specs, 240 V steel: 24 ga.–3/8 in.' },
      { process: 'flux', metals: ['mild-steel'], voltage: 120, maxIn: 0.1875, text: 'Quick specs list one steel thickness block beside MIG and flux-cored. 120 V: 24 ga.–3/16 in.' },
      { process: 'flux', metals: ['mild-steel'], voltage: 240, maxIn: 0.375, text: 'Quick specs list one steel thickness block beside MIG and flux-cored. 240 V: 24 ga.–3/8 in.' },
      { process: 'mig', metals: ['aluminum'], voltage: 120, maxIn: 0.125, text: 'Quick specs, 120 V aluminum: 18 ga.–1/8 in.' },
      { process: 'mig', metals: ['aluminum'], voltage: 240, maxIn: 0.375, text: 'Quick specs, 240 V aluminum: 18 ga.–3/8 in.' },
    ],
    processes: field('MIG (GMAW), pulsed MIG (GMAW-P), and flux-cored (FCAW).', MM211S, 'Quick specs, Processes'),
    output: field('30–230 A on the product page. The spec sheet does not print a separate amp range by voltage.', MM211P, 'Product page specifications, Amperage Range'),
    duty: field('120 V: 110 A at 19.5 VDC, 60% duty cycle. 240 V: 160 A at 22.0 VDC, 60% duty cycle.', MM211S, 'Quick specs, Rated Output'),
    input: field('120 V: 27.0 A, single-phase, 50/60 Hz. 240 V: 28.9 A, single-phase, 50/60 Hz. The sheet says the cord uses MVP plugs for 120 V and 240 V and does not name a breaker size.', MM211S, 'Quick specs, Input Power, and the included-cord line'),
    wire: field('Included Quick Select drive roll for .024 in. (0.6 mm) or .030/.035 in. (0.8/0.9 mm) solid wire, and .030/.035 in. (0.8/0.9 mm) flux-cored wire.', MM211S, 'Comes complete with, drive roll'),
    weight: field('35 lb.', MM211S, 'Quick-spec weight callout. The product page also lists net weight 35 lb.'),
    thickness: field('120 V: 24 ga.–3/16 in. steel and 18 ga.–1/8 in. aluminum. 240 V: 24 ga.–3/8 in. steel and 18 ga.–3/8 in. aluminum.', MM211S, 'Quick specs, Weld Thickness'),
    productUrl: MM211P,
    searchQuery: 'Miller Millermatic 211 PRO welder',
    summary: 'Dual-voltage MIG, pulsed MIG, and flux-cored welder. Miller publishes 110 A at 60% on 120 V and 160 A at 60% on 240 V.',
    notes: ['Input current is the amperes at rated output. The sheet does not print a recommended breaker.'],
  },
  {
    slug: 'millermatic-252',
    brand: 'Miller',
    brandSlug: 'miller',
    name: 'Millermatic 252',
    sku: '907321',
    procs: ['mig', 'flux'],
    namedMetals: ['stainless', 'aluminum'],
    acTig: false,
    voltages: [240],
    weightLb: 205,
    draws: [{ voltage: 240, inputA: 50.8 }],
    caps: [],
    processes: field('MIG (GMAW) and flux-cored (FCAW).', MM252S, 'Quick specs, Processes'),
    output: field('30–300 A.', MM252S, 'Quick specs, Amperage Range, and the specifications table'),
    duty: field('200 A at 24 VDC, 60% duty cycle. 250 A at 26.5 VDC, 40% duty cycle.', MM252S, 'Quick specs, Rated Output'),
    input: field('208/240 V, single-phase, 60 Hz, or 230/460/575 V, single-phase, 60 Hz. On the 208/240 V row, amps input at the 200 A, 60% rating are 57.0 A at 208 V and 50.8 A at 240 V.', MM252S, 'Quick specs, Input Power, and the specifications table'),
    wire: field('Solid/stainless steel .023–.045 in. (0.6–1.2 mm). Flux-cored .030–.045 in. (0.8–1.2 mm). 12 in. spool.', MM252S, 'Specifications table, wire type and diameter'),
    weight: field('205 lb. (93 kg).', MM252S, 'Quick specs, Net Weight'),
    thickness: missing(MM252S, 'Quick specs and the specifications table do not print a material thickness.'),
    productUrl: MM252P,
    searchQuery: 'Miller Millermatic 252 welder',
    summary: '240 V class MIG and flux-cored welder. Miller publishes 250 A at 26.5 VDC, 40% duty cycle, and a 205 lb weight.',
    notes: [
      'The sheet also sells a 230/460/575 V configuration. A 120 V outlet is outside both published input lines.',
      '“Superior aluminum MIG welding” is a spool-gun feature on this sheet. No aluminum thickness is printed.',
    ],
  },
  {
    slug: 'millermatic-255',
    brand: 'Miller',
    brandSlug: 'miller',
    name: 'Millermatic 255',
    sku: '907734',
    procs: ['mig', 'flux'],
    namedMetals: [],
    acTig: false,
    voltages: [240],
    weightLb: 84,
    draws: [],
    caps: [],
    processes: field('MIG (GMAW), pulsed MIG (GMAW-P), and flux-cored (FCAW).', MM255S, 'Quick specs, Processes'),
    output: field('20–350 A.', MM255S, 'Quick specs, Amperage Range'),
    duty: field('230 A at 25.5 V, 60% duty cycle.', MM255S, 'Quick specs, Rated Output'),
    input: field('208–240 V, single-phase. Auto-Line 208–575 V, single-phase. The quick specs do not print input amperes.', MM255S, 'Quick specs, Input Power'),
    wire: missing(MM255S, 'The quick specs do not print a wire-diameter range.'),
    weight: field('Machine only: 84 lb. (38 kg). Machine with running gear: 148 lb. (67 kg).', MM255S, 'Quick specs, Net Weight'),
    thickness: missing(MM255S, 'The quick specs do not print a material thickness.'),
    productUrl: MM255P,
    searchQuery: 'Miller Millermatic 255 welder',
    summary: 'Single-phase MIG welder with Auto-Line input from 208 V. Miller publishes 230 A at 25.5 V, 60% duty cycle.',
    notes: ['120 V is below the published 208 V minimum.'],
  },
  {
    slug: 'multimatic-215-pro',
    brand: 'Miller',
    brandSlug: 'miller',
    name: 'Multimatic 215 PRO',
    sku: '907840',
    procs: ['mig', 'flux', 'stick', 'tig'],
    namedMetals: ['mild-steel', 'aluminum'],
    acTig: false,
    voltages: [120, 240],
    weightLb: 35,
    draws: [],
    caps: [
      { process: 'mig', metals: ['mild-steel'], voltage: 120, maxIn: 0.1875, text: 'Quick specs, 120 V steel: 24 ga.–3/16 in.' },
      { process: 'mig', metals: ['mild-steel'], voltage: 240, maxIn: 0.375, text: 'Quick specs, 240 V steel: 24 ga.–3/8 in.' },
      { process: 'mig', metals: ['aluminum'], voltage: 120, maxIn: 0.125, text: 'Quick specs, 120 V aluminum: 18 ga.–1/8 in.' },
      { process: 'mig', metals: ['aluminum'], voltage: 240, maxIn: 0.375, text: 'Quick specs, 240 V aluminum: 18 ga.–3/8 in.' },
      { process: 'flux', metals: ['mild-steel'], voltage: 120, maxIn: 0.1875, text: 'The weld-thickness block is printed once beside MIG, pulsed MIG, and flux-cored. 120 V steel: 24 ga.–3/16 in.' },
      { process: 'flux', metals: ['mild-steel'], voltage: 240, maxIn: 0.375, text: 'The weld-thickness block is printed once beside MIG, pulsed MIG, and flux-cored. 240 V steel: 24 ga.–3/8 in.' },
    ],
    processes: field('MIG (GMAW), pulsed MIG (GMAW-P), flux-cored (FCAW), DC TIG (GTAW), pulsed TIG (GTAW-P), and DC stick (SMAW).', M215S, 'Quick specs, Processes'),
    output: field('20–230 A on the product page.', M215P, 'Product page specifications, Amperage Range'),
    duty: field('120 V: 110 A at 19.5 VDC, 60% duty cycle. 240 V: 160 A at 22.0 VDC, 60% duty cycle, and 215 A at 24.8 VDC, 30% duty cycle.', M215S, 'Quick specs, Rated Output'),
    input: field('120 or 240 V, single-phase, 50/60 Hz. MVP plugs for 120 V and 240 V are included. Input amperes are not in the quick specs.', M215S, 'Quick specs, Input Power, and the included-cord line'),
    wire: field('The features page says the machine is used with .024–.035 in. (0.6–0.9 mm) solid wire and .030–.045 in. (0.8–1.2 mm) flux-cored wire. The included drive roll is grooved for .024 in. or .030/.035 in. solid and .030/.035 in. flux-cored.', M215S, 'Features, wire sentence, and Comes complete with'),
    weight: field('35 lb.', M215S, 'Quick-spec weight callout'),
    thickness: field('120 V: 24 ga.–3/16 in. steel and 18 ga.–1/8 in. aluminum. 240 V: 24 ga.–3/8 in. steel and 18 ga.–3/8 in. aluminum. Stick and TIG thickness are not printed in that block.', M215S, 'Quick specs, Weld Thickness'),
    productUrl: M215P,
    searchQuery: 'Miller Multimatic 215 PRO welder',
    summary: 'Dual-voltage multi-process welder. Miller publishes MIG, flux-cored, DC TIG, and DC stick, with 215 A at 30% duty cycle on 240 V.',
    notes: ['TIG on this sheet is DC. The sheet does not call it AC TIG.'],
  },
  {
    slug: 'multimatic-220-ac-dc',
    brand: 'Miller',
    brandSlug: 'miller',
    name: 'Multimatic 220 AC/DC',
    sku: '907757',
    procs: ['mig', 'flux', 'stick', 'tig'],
    namedMetals: [],
    acTig: true,
    voltages: [120, 240],
    weightLb: 56,
    draws: [
      { voltage: 120, process: 'mig', inputA: 23.3 },
      { voltage: 240, process: 'mig', inputA: 27.2 },
      { voltage: 120, process: 'flux', inputA: 23.3 },
      { voltage: 240, process: 'flux', inputA: 27.2 },
      { voltage: 120, process: 'stick', inputA: 24.5 },
      { voltage: 240, process: 'stick', inputA: 31.3 },
      { voltage: 120, process: 'tig', inputA: 24 },
      { voltage: 240, process: 'tig', inputA: 22.4 },
    ],
    caps: [],
    processes: field('MIG (GMAW), flux-cored (FCAW), DC stick (SMAW), AC/DC TIG (GTAW), and pulsed TIG (GTAW-P).', M220S, 'Quick specs, Processes'),
    output: field('MIG: 30–230 A. DC stick: 30–200 A. AC/DC TIG: 20–210 A. The specifications table splits those ranges by voltage: MIG 30–125 A on 120 V and 30–230 A on 240 V; stick 30–90 A on 120 V and 30–200 A on 240 V; TIG 20–140 A on 120 V and 20–210 A on 240 V.', M220S, 'Quick specs, Amperage Range, and the specifications table'),
    duty: field('MIG: 120 V, 105 A at 19.2 V, 60% duty cycle; 240 V, 200 A at 24 V, 20% duty cycle and 170 A at 21.5 V, 40% duty cycle. Stick: 120 V, 90 A at 23.6 V, 40%; 240 V, 200 A at 28.4 V, 15%. TIG: 120 V, 130 A at 15.2 V, 40%; 240 V, 210 A at 18.4 V, 20%.', M220S, 'Specifications table, rated output'),
    input: field('120/240 V, single-phase, 50/60 Hz. Amps input at rated output: MIG 23.3 A at 120 V and 27.2 A at the 200 A / 20% 240 V rating; stick 24.5 A at 120 V and 31.3 A at 240 V; TIG 24.0 A at 120 V and 22.4 A at 240 V.', M220S, 'Quick specs, Input Power, and the specifications table'),
    wire: field('Included Quick Select drive roll for .024 in. (0.6 mm) or .030/.035 in. (0.8/0.9 mm) solid wire, and .030/.035 in. (0.8/0.9 mm) flux-cored wire. Wire feed speed in the table is 60–600 ipm.', M220S, 'Comes complete with, and the specifications table'),
    weight: field('56 lb. (25.4 kg).', M220S, 'Quick specs, Net Weight'),
    thickness: missing(M220S, 'The quick specs and the specifications table do not print a material thickness.'),
    productUrl: M220P,
    searchQuery: 'Miller Multimatic 220 AC/DC welder',
    summary: '120/240 V multi-process welder with AC/DC TIG. Miller’s table rates MIG at 200 A, 20% duty cycle on 240 V.',
    notes: ['The sheet describes AC balance as cleaning action. It does not name aluminum in the quick specs, so aluminum is not marked as a named metal.'],
  },
  {
    slug: 'multimatic-235',
    brand: 'Miller',
    brandSlug: 'miller',
    name: 'Multimatic 235',
    sku: '907780',
    procs: ['mig', 'flux', 'stick', 'tig'],
    namedMetals: [],
    acTig: false,
    voltages: [240],
    weightLb: 63,
    draws: [],
    caps: [],
    processes: field('MIG (GMAW), flux-cored (FCAW), DC stick (SMAW), DC Lift-Arc TIG (GTAW), and pulsed TIG (GTAW-P).', M235S, 'Quick specs, Processes'),
    output: field('20–235 A.', M235S, 'Quick specs, Amperage Range'),
    duty: field('MIG: 170 A at 22.5 V, 60% duty cycle. Stick: 150 A at 26 V, 60% duty cycle. TIG: 180 A at 17.2 V, 60% duty cycle.', M235S, 'Quick specs, Rated Output'),
    input: field('240 V, single-phase. Input amperes are not in the quick specs.', M235S, 'Quick specs, Input Power'),
    wire: missing(M235S, 'The quick specs do not print a wire-diameter range.'),
    weight: field('Machine only: 63 lb. (29 kg). Machine with running gear: 127 lb. (58 kg).', M235S, 'Quick specs, Net Weight'),
    thickness: missing(M235S, 'The quick specs do not print a material thickness.'),
    productUrl: M235P,
    searchQuery: 'Miller Multimatic 235 welder',
    summary: '240 V multi-process welder. Miller publishes MIG, stick, and DC TIG ratings, each at 60% duty cycle.',
    notes: ['There is no 120 V input line on this sheet.'],
  },
  {
    slug: 'multimatic-255',
    brand: 'Miller',
    brandSlug: 'miller',
    name: 'Multimatic 255',
    sku: '907728',
    procs: ['mig', 'flux', 'stick', 'tig'],
    namedMetals: ['aluminum', 'stainless'],
    acTig: false,
    voltages: [240],
    weightLb: 84,
    draws: [],
    caps: [],
    processes: field('MIG (GMAW), pulsed MIG (GMAW-P), flux-cored (FCAW), DC stick (SMAW), DC Lift-Arc TIG (GTAW), and pulsed TIG (GTAW-P).', M255S, 'Quick specs, Processes'),
    output: field('5–350 A.', M255S, 'Quick specs, Amperage Range'),
    duty: field('MIG: 230 A at 25.5 V, 60% duty cycle. Stick: 200 A at 28 V, 60% duty cycle. TIG: 275 A at 21 V, 60% duty cycle.', M255S, 'Quick specs, Rated Output'),
    input: field('Auto-Line 208–575 V, single-phase. Input amperes are not in the quick specs.', M255S, 'Quick specs, Input Power'),
    wire: missing(M255S, 'The quick specs do not print a wire-diameter range.'),
    weight: field('Machine only: 84 lb. (38 kg). Machine with running gear: 148 lb. (67 kg).', M255S, 'Quick specs, Net Weight'),
    thickness: missing(M255S, 'The quick specs do not print a material thickness.'),
    productUrl: M255P,
    searchQuery: 'Miller Multimatic 255 welder',
    summary: 'Auto-Line multi-process welder from 208 V. Miller publishes a 230 A MIG rating at 60% duty cycle.',
    notes: ['A features sentence says the machine is ideal for MIG welding aluminum and stainless steel. No thickness is attached to that sentence.'],
  },
  {
    slug: 'thunderbolt-210-mv',
    brand: 'Miller',
    brandSlug: 'miller',
    name: 'Thunderbolt 210 MV',
    sku: '907909',
    procs: ['stick'],
    namedMetals: ['mild-steel'],
    acTig: false,
    voltages: [120, 240],
    weightLb: 13,
    draws: [
      { voltage: 120, process: 'stick', inputA: 27.8 },
      { voltage: 240, process: 'stick', inputA: 44.9 },
    ],
    caps: [
      { process: 'stick', metals: ['mild-steel'], voltage: 120, maxIn: 0.125, text: 'Quick specs: maximum mild steel thickness, 120 V, 1/8 in.' },
      { process: 'stick', metals: ['mild-steel'], voltage: 240, maxIn: 0.5, text: 'Quick specs: maximum mild steel thickness, 240 V, 1/2 in.' },
    ],
    processes: field('Stick (SMAW).', TB210S, 'Quick specs, Process'),
    output: field('120 V: 10–110 A. 240 V: 10–210 A.', TB210S, 'Quick specs, Amperage Range'),
    duty: field('120 V: 65 A at 60% duty cycle and 50 A at 100% duty cycle. 240 V: 135 A at 60% duty cycle and 105 A at 100% duty cycle.', TB210S, 'Specifications table, Rated Output'),
    input: field('1-phase power, 120 V or 240 V, 50/60 Hz. Maximum amps input at rated load output: 27.8 A at 120 V and 44.9 A at 240 V. The cord includes multi-voltage plugs for 120 V and 240 V.', TB210S, 'Quick specs and the specifications table'),
    wire: missing(TB210S, 'This is a stick welder. The quick specs do not print an electrode-diameter range.'),
    weight: field('13 lb.', TB210S, 'Specifications table, net weight'),
    thickness: field('Maximum mild steel thickness: 120 V, 1/8 in. 240 V, 1/2 in.', TB210S, 'Quick specs, Maximum Mild Steel Thickness'),
    productUrl: TB210P,
    searchQuery: 'Miller Thunderbolt 210 MV stick welder',
    summary: 'Dual-voltage DC stick welder. Miller publishes 1/8 in. mild steel on 120 V and 1/2 in. on 240 V.',
    notes: ['Open-circuit voltage in the specifications table is 9.5 V.'],
  },
  {
    slug: 'maxstar-161-sth',
    brand: 'Miller',
    brandSlug: 'miller',
    name: 'Maxstar 161 STH',
    sku: '907711',
    procs: ['tig', 'stick'],
    namedMetals: [],
    acTig: false,
    voltages: [120, 240],
    weightLb: 13,
    draws: [
      { voltage: 120, process: 'tig', inputA: 22.6 },
      { voltage: 240, process: 'tig', inputA: 15.05 },
      { voltage: 120, process: 'stick', inputA: 23.16 },
      { voltage: 240, process: 'stick', inputA: 22.55 },
    ],
    caps: [],
    processes: field('Stick (SMAW), Lift-Arc TIG (GTAW), high-frequency TIG (GTAW), and pulsed TIG (GTAW-P). High frequency and pulse are marked STH model only.', MX161S, 'Quick specs, Processes'),
    output: field('120 V: 5–130 A DC TIG and 20–90 A DC stick. 240 V: 5–160 A DC TIG and 20–160 A DC stick.', MX161S, 'Quick specs, Amperage Range, and the specifications table'),
    duty: field('TIG, 120 V: 90 A at 13.6 VDC, 100% duty cycle, and 130 A at 15.2 VDC, 30%. TIG, 240 V: 110 A at 14.4 VDC, 100%, and 160 A at 16.4 VDC, 20%. Stick, 120 V: 60 A at 22.4 VDC, 100%, and 90 A at 23.6 VDC, 30%. Stick, 240 V: 110 A at 24.4 VDC, 100%, and 160 A at 26.4 VDC, 20%.', MX161S, 'Specifications table, Rated Output'),
    input: field('120–240 V, 1-phase. Amps input at the higher duty-point ratings: TIG 22.6 A at 120 V and 15.05 A at 240 V; stick 23.16 A at 120 V and 22.55 A at 240 V. Separate 120 V and 240 V power cords are included.', MX161S, 'Quick specs, Input Power, and the specifications table'),
    wire: missing(MX161S, 'The specifications table does not print a tungsten or stick-electrode diameter range.'),
    weight: field('13 lb. (5.9 kg).', MX161S, 'Quick specs, Net Weight'),
    thickness: missing(MX161S, 'The quick specs and the specifications table do not print a material thickness.'),
    productUrl: MX161P,
    searchQuery: 'Miller Maxstar 161 STH welder',
    summary: 'DC stick and TIG package at 13 lb. Miller publishes up to 160 A TIG on 240 V at 20% duty cycle.',
    notes: ['The quick specs do not name a weld metal. TIG on this sheet is DC.'],
  },
  {
    slug: 'syncrowave-212',
    brand: 'Miller',
    brandSlug: 'miller',
    name: 'Syncrowave 212',
    sku: '907911',
    procs: ['tig', 'stick', 'mig'],
    namedMetals: ['aluminum'],
    acTig: true,
    voltages: [120, 240],
    weightLb: 54,
    draws: [
      { voltage: 120, process: 'tig', inputA: 18.8 },
      { voltage: 240, process: 'tig', inputA: 11.8 },
      { voltage: 240, process: 'stick', inputA: 16.3 },
    ],
    caps: [
      { process: 'tig', metals: [], voltage: 120, maxIn: 0.125, text: 'Specifications table, AC/DC TIG material thickness, 120 V: 20 gauge–1/8 in.' },
      { process: 'tig', metals: [], voltage: 240, maxIn: 0.25, text: 'Specifications table, AC/DC TIG material thickness, 240 V: 20 gauge–1/4 in.' },
      { process: 'stick', metals: [], voltage: 120, maxIn: 0.1875, text: 'Specifications table, DC stick material thickness, 120 V: 16 gauge–3/16 in.' },
      { process: 'stick', metals: [], voltage: 240, maxIn: 0.375, text: 'Specifications table, DC stick material thickness, 240 V: 16 gauge–3/8 in.' },
      { process: 'mig', metals: [], voltage: 120, maxIn: 0.125, text: 'Specifications table, MIG spool gun material thickness, 120 V: 1/8 in.' },
      { process: 'mig', metals: [], voltage: 240, maxIn: 0.375, text: 'Specifications table, MIG spool gun material thickness, 240 V: 1/8–3/8 in.' },
    ],
    processes: field('AC/DC TIG (GTAW), pulsed DC TIG (GTAW-P), DC stick (SMAW), and MIG (GMAW) with a Spoolmate 150.', SW212S, 'Quick specs, Processes'),
    output: field('AC/DC TIG: 20–210 A. DC stick: 30–200 A. MIG: 30–175 A. The specifications table narrows 120 V DC TIG to 20–140 A and 240 V DC stick to 35–160 A.', SW212S, 'Quick specs, Amperage Range, and the specifications table'),
    duty: field('Quick specs lead with 130 A at 15.2 V, 60% duty cycle. The table adds, at 60%: 120 V DC TIG 110 A at 14.4 V, and 240 V DC stick 120 A at 24.8 V. It also prints 210 A at 20% and 120 A at 100% on the AC/DC TIG duty column, without tying those two lines to one voltage.', SW212S, 'Quick specs and the specifications table'),
    input: field('120–240 V, 1-phase, 50/60 Hz. Amps input at rated output in the table: 18.8 A for 120 V DC TIG and 11.8 A for 240 V DC TIG. The 240 V DC stick row prints 16.3 A.', SW212S, 'Quick specs, Input Power, and the specifications table'),
    wire: missing(SW212S, 'The specifications table does not print a filler-diameter range. MIG is described as requiring the Spoolmate 150.'),
    weight: field('54 lb. (24.5 kg), air-cooled machine only.', SW212S, 'Quick specs, Net Weight'),
    thickness: field('AC/DC TIG: 120 V, 20 gauge–1/8 in.; 240 V, 20 gauge–1/4 in. DC stick: 120 V, 16 gauge–3/16 in.; 240 V, 16 gauge–3/8 in. MIG spool gun: 120 V, 1/8 in.; 240 V, 1/8–3/8 in. The table does not name the metal.', SW212S, 'Specifications table, material thickness range'),
    productUrl: SW212P,
    searchQuery: 'Miller Syncrowave 212 welder',
    summary: 'AC/DC TIG welder that also lists DC stick and spool-gun MIG. Miller publishes aluminum in the AC-balance description and a 54 lb air-cooled weight.',
    notes: ['AC balance is described as oxide removal “essential for creating the highest quality aluminum welds.” The thickness columns are not labeled by metal.'],
  },
  {
    slug: 'dynasty-210',
    brand: 'Miller',
    brandSlug: 'miller',
    name: 'Dynasty 210',
    sku: '907816',
    procs: ['tig', 'stick'],
    namedMetals: ['aluminum'],
    acTig: true,
    voltages: [120, 240],
    weightLb: 47,
    draws: [],
    caps: [],
    processes: field('AC/DC TIG (GTAW), pulsed TIG (GTAW-P), and stick (SMAW).', DY210S, 'Quick specs, Processes'),
    output: field('1–210 A DC and 2–210 A AC.', DY210S, 'Quick specs, Amperage Range'),
    duty: field('210 A at 18.4 V, 60% duty cycle.', DY210S, 'Quick specs, Rated Output'),
    input: field('120–480 V, 3-phase or 1-phase. The quick specs do not print input amperes.', DY210S, 'Quick specs, Input Power'),
    wire: missing(DY210S, 'The quick specs do not print a tungsten or electrode diameter range.'),
    weight: field('47 lb. (21.3 kg).', DY210S, 'Quick specs, Net Weight'),
    thickness: missing(DY210S, 'The quick specs do not print a material thickness. A later table header names thickness columns; the figures on that table were not aligned clearly enough to transcribe.'),
    productUrl: DY210P,
    searchQuery: 'Miller Dynasty 210 TIG welder',
    summary: 'AC/DC TIG and stick welder, 120–480 V. Miller publishes 210 A at 18.4 V, 60% duty cycle, and a 47 lb weight.',
    notes: ['The AC TIG section says balance control provides oxide removal “essential for creating the highest quality aluminum welds.”'],
  },
  {
    slug: 'handler-125',
    brand: 'Hobart',
    brandSlug: 'hobart',
    name: 'Handler 125',
    sku: '500573',
    procs: ['mig', 'flux'],
    namedMetals: ['mild-steel', 'stainless'],
    acTig: false,
    voltages: [120],
    weightLb: 57.5,
    draws: [{ voltage: 120, inputA: 21.3 }],
    caps: [
      { process: 'flux', metals: ['mild-steel'], voltage: 120, maxIn: 0.1875, text: 'Quick specs: mild steel thickness range 24 ga.–3/16 in.' },
      { process: 'mig', metals: ['mild-steel'], voltage: 120, maxIn: 0.1875, text: 'Quick specs: mild steel thickness range 24 ga.–3/16 in. A separate sentence recommends C-25 on 24 gauge–1/8 inch steel and is not used as a lower maximum.' },
    ],
    processes: field('Flux-cored out of the box, and MIG after a regulator and shielding gas are added. The sheet calls it a constant-voltage DC welder.', H125S, 'Opening description'),
    output: field('25–130 A.', H125S, 'Quick specs, Welding Amp Range'),
    duty: field('80 A at 25% duty cycle. The specifications table also prints 50 A at 60% and 40 A at 100%.', H125S, 'Quick specs and the specifications table'),
    input: field('120 V. Amps input at rated output, 60 Hz: 21.3 A. The sheet says it operates on common 120-volt power and includes a power cord with plug. It does not name the plug or a breaker size.', H125S, 'Quick specs and the specifications table'),
    wire: field('Ready to weld with .030–.035 in. (0.8–0.9 mm) self-shielding flux-cored wire. With gas, .023–.030 in. (0.6–0.8 mm) solid wire. Stainless wire is mentioned for 18–12 gauge stainless with tri-mix gas.', H125S, 'Opening description'),
    weight: field('57.5 lb.', H125P, 'Product page specifications, Net Weight. The spec-sheet table that was read does not print weight.'),
    thickness: field('Mild steel thickness range 24 ga.–3/16 in. The same page limits the gas-shielded example to 24 gauge–1/8 inch steel.', H125S, 'Quick specs and the MIG gas sentence'),
    productUrl: H125P,
    searchQuery: 'Hobart Handler 125 welder',
    summary: '120 V wire welder. Hobart publishes 25–130 A, 80 A at 25% duty cycle, and 21.3 A input at rated output.',
    notes: ['Weight is from the Hobart product page. The spec sheet’s table does not include a weight cell.'],
  },
  {
    slug: 'handler-140ez',
    brand: 'Hobart',
    brandSlug: 'hobart',
    name: 'Handler 140EZ',
    sku: '500582',
    procs: ['mig', 'flux'],
    namedMetals: ['mild-steel'],
    acTig: false,
    voltages: [120],
    draws: [{ voltage: 120, inputA: 20 }],
    caps: [
      { process: 'mig', metals: ['mild-steel'], voltage: 120, maxIn: 0.1875, singlePass: true, text: 'The sheet says it welds as thin as 24 gauge up to 3/16 inch in a single pass, and that thicker material takes multiple passes. No multi-pass maximum is printed.' },
      { process: 'flux', metals: ['mild-steel'], voltage: 120, maxIn: 0.1875, singlePass: true, text: 'The 24 gauge to 3/16 inch single-pass sentence is not split by wire type.' },
    ],
    processes: field('MIG and flux-cored. The included drive roll has grooves for solid wire and flux-cored wire, and the machine includes a gas solenoid and regulator.', H140S, 'Includes list and the opening description'),
    output: field('30–140 A.', H140S, 'Quick specs, Welding Amp Range'),
    duty: field('90 A at 18.5 VDC, 30% duty cycle.', H140S, 'Quick specs, Rated Output'),
    input: field('120-volt power. Amps input at rated output, 60 Hz, 115 V column: 20 A. A power cord with plug is included. The plug type is not named.', H140S, 'Opening description and the specifications table'),
    wire: field('Quick Select drive roll for .024 in. (0.6 mm) or .030/.035 in. (0.8/0.9 mm) solid wire, and .030/.035 in. (0.8/0.9 mm) flux-cored wire.', H140S, 'Includes list'),
    weight: missing(H140S, 'The specifications table does not print a net weight, and the product-page fields read on 2 November 2026 did not include one.'),
    thickness: field('Mild steel thickness range 24 ga.–3/16 in., described as a single pass, with thicker material by multiple passes and prep.', H140S, 'Quick specs and the opening paragraph'),
    productUrl: H140P,
    searchQuery: 'Hobart Handler 140EZ welder',
    summary: '120 V MIG and flux-cored welder. Hobart publishes 30–140 A and 90 A at 18.5 VDC, 30% duty cycle.',
    notes: ['The sheet says the Handler 140EZ is not recommended for use with engine-driven welders or standalone generators.'],
  },
  {
    slug: 'handler-210mvp',
    brand: 'Hobart',
    brandSlug: 'hobart',
    name: 'Handler 210MVP',
    sku: '500553',
    procs: ['mig', 'flux'],
    namedMetals: ['mild-steel', 'aluminum'],
    acTig: false,
    voltages: [120, 240],
    weightLb: 79,
    draws: [
      { voltage: 120, inputA: 20 },
      { voltage: 240, inputA: 24 },
    ],
    caps: [
      { process: 'mig', metals: ['mild-steel'], maxIn: 0.375, singlePass: true, text: 'Mild steel thickness range 24 ga.–3/8 in. The sheet says up to 3/8 inch in a single pass, and thicker material with multiple passes. It does not split that range by voltage.' },
      { process: 'flux', metals: ['mild-steel'], maxIn: 0.375, singlePass: true, text: 'The 24 ga.–3/8 in. mild steel range is not split by wire type.' },
    ],
    processes: field('MIG and flux-cored. Spool-gun circuitry is described for aluminum wire. A gas solenoid and regulator are included.', H210S, 'Includes list and the spool-gun feature'),
    output: field('115 V: 25–140 A. 230 V: 25–210 A.', H210S, 'Quick specs, Welding Amp Range'),
    duty: field('115 V: 90 A at 19 VDC, 20% duty cycle. 230 V: 150 A at 23 VDC, 30% duty cycle.', H210S, 'Quick specs, Rated Output'),
    input: field('115 V or 230 V, 60 Hz. Amps input at rated output: 20 A at 115 V and 24 A at 230 V. The cord includes 5-15P (115 V, 15 A) and 6-50P (230 V, 50 A) MVP plugs.', H210S, 'Specifications table and the includes list'),
    wire: field('Quick Select drive roll for .024 in. (0.6 mm) or .030/.035 in. (0.8/0.9 mm) solid wire, and .030/.035 in. (0.8/0.9 mm) flux-cored wire.', H210S, 'Includes list'),
    weight: field('79 lb. (35.8 kg).', H210S, 'Specifications table, net weight'),
    thickness: field('Mild steel thickness range 24 ga.–3/8 in., in a single pass. The sheet says thicker material is run with multiple passes and does not print that second maximum.', H210S, 'Quick specs and the opening paragraph'),
    productUrl: H210P,
    searchQuery: 'Hobart Handler 210MVP welder',
    summary: '115/230 V MIG welder. Hobart publishes 90 A at 20% on 115 V and 150 A at 30% on 230 V.',
    notes: ['The included 115 V plug is labeled 15 A, while input at the 90 A rating is 20 A. Both figures are printed. The job check uses the 20 A input current.'],
  },
  {
    slug: 'handler-210i',
    brand: 'Hobart',
    brandSlug: 'hobart',
    name: 'Handler 210i',
    sku: '500588',
    procs: ['mig', 'flux'],
    namedMetals: ['mild-steel', 'aluminum'],
    acTig: false,
    voltages: [120, 240],
    weightLb: 26,
    draws: [
      { voltage: 120, onBreakerA: 15, inputA: 13.8 },
      { voltage: 120, onBreakerA: 20, inputA: 27.6 },
      { voltage: 240, inputA: 44.3 },
    ],
    caps: [
      { process: 'mig', metals: ['mild-steel'], maxIn: 0.375, singlePass: true, text: 'Mild steel thickness range 24 ga.–3/8 in. in a single pass. The sheet says thicker material is run with multiple passes and does not print that maximum. The range is not split by the 15 A and 20 A rows.' },
      { process: 'flux', metals: ['mild-steel'], maxIn: 0.375, singlePass: true, text: 'The 24 ga.–3/8 in. mild steel range is not split by wire type.' },
    ],
    processes: field('MIG and flux-cored. The included drive roll covers solid and flux-cored wire, and spool-gun circuitry is described for aluminum wire.', H210IS, 'Includes list and the spool-gun feature'),
    output: field('120 V: 30–140 A. 240 V: 30–210 A.', H210IS, 'Quick specs and the specifications table'),
    duty: field('120 V, 15 A: 45 A at 16.3 VDC, 100% duty cycle. 120 V, 20 A: 90 A at 18.5 VDC, 25% duty cycle, and 60 A at 17.0 VDC, 100% duty cycle. 240 V: 210 A at 24.5 VDC, 25% duty cycle, and 105 A at 19.3 VDC, 100% duty cycle.', H210IS, 'Quick specs and the specifications table'),
    input: field('120 V or 240 V, 50/60 Hz, with an included adapter for both. Amps input at rated output: 13.8 A on the 120 V, 15 A row; 27.6 A on the 120 V, 20 A row; 44.3 A on 240 V.', H210IS, 'Specifications table'),
    wire: field('Quick Select drive roll for .024 in. (0.6 mm) or .030/.035 in. (0.8/0.9 mm) solid wire, and .030/.035 in. (0.8/0.9 mm) flux-cored wire.', H210IS, 'Includes list'),
    weight: field('26 lb. The sheet says the machine weighs only 26 pounds.', H210IS, 'Opening description'),
    thickness: field('Mild steel thickness range 24 ga.–3/8 in., in a single pass, with thicker material by multiple passes.', H210IS, 'Quick specs and the opening paragraph'),
    productUrl: H210IP,
    searchQuery: 'Hobart Handler 210i welder',
    summary: '120/240 V inverter MIG welder at 26 lb. Hobart prints separate 15 A and 20 A ratings on 120 V.',
    notes: ['A 120 V, 15 A row and a 120 V, 20 A row are both published. The job check uses the highest row whose breaker is no larger than the breaker entered.'],
  },
  {
    slug: 'ironman-240',
    brand: 'Hobart',
    brandSlug: 'hobart',
    name: 'IronMan 240',
    sku: '500574',
    procs: ['mig', 'flux'],
    namedMetals: ['mild-steel', 'aluminum'],
    acTig: false,
    voltages: [240],
    weightLb: 186,
    draws: [{ voltage: 240, inputA: 50.8 }],
    caps: [
      { process: 'mig', metals: ['mild-steel'], voltage: 240, maxIn: 0.5, text: 'Quick specs: mild steel thickness range 24 ga.–1/2 in. The opening text says up to 1/2 inch (13 mm) mild steel.' },
      { process: 'flux', metals: ['mild-steel'], voltage: 240, maxIn: 0.5, text: 'The 24 ga.–1/2 in. mild steel range is not split by wire type.' },
    ],
    processes: field('MIG and flux-cored. Spool-gun connection is described for aluminum wire.', IM240S, 'Spool-gun feature and the wire-feed description'),
    output: field('30–280 A.', IM240S, 'Quick specs, Welding Amp Range'),
    duty: field('200 A at 24 VDC, 60% duty cycle.', IM240S, 'Quick specs, Rated Output'),
    input: field('208 V and 240 V. Amperes input at rated load: 57.0 A at 208 V and 50.8 A at 240 V, on the 200 A, 60% row. A power cord with plug is included. The plug is not named.', IM240S, 'Specifications table'),
    wire: field('The gun note on the sheet says .023–.045 in. (0.6–1.1 mm) wire, and the included drive roll is a dual-groove .030/.035 in. roll. Wire feed speed is 50–700 ipm.', IM240S, 'Includes list, specifications table, and the gun note'),
    weight: field('186 lb.', IM240P, 'Product page specifications, Net Weight'),
    thickness: field('Mild steel thickness range 24 ga.–1/2 in. (13 mm).', IM240S, 'Quick specs and the opening paragraph'),
    productUrl: IM240P,
    searchQuery: 'Hobart IronMan 240 welder',
    summary: '240 V MIG welder. Hobart publishes 30–280 A, 200 A at 24 VDC and 60% duty cycle, and mild steel to 1/2 in.',
    notes: ['The sheet says running off generator power is not recommended. There is no 120 V input row.'],
  },
  {
    slug: 'multi-handler-200',
    brand: 'Hobart',
    brandSlug: 'hobart',
    name: 'Multi-Handler 200',
    sku: '500578',
    procs: ['mig', 'flux', 'tig', 'stick'],
    namedMetals: ['mild-steel', 'aluminum'],
    acTig: false,
    voltages: [120, 240],
    weightLb: 38.4,
    draws: [
      { voltage: 120, process: 'mig', inputA: 23 },
      { voltage: 240, process: 'mig', inputA: 19 },
      { voltage: 120, process: 'flux', inputA: 23 },
      { voltage: 240, process: 'flux', inputA: 19 },
      { voltage: 120, process: 'tig', inputA: 16.7 },
      { voltage: 240, process: 'tig', inputA: 14.7 },
      { voltage: 120, process: 'stick', inputA: 22 },
      { voltage: 240, process: 'stick', inputA: 17.9 },
    ],
    caps: [
      { process: 'mig', metals: ['mild-steel'], maxIn: 0.375, text: 'Quick specs: MIG/flux-cored mild steel 24 ga.–3/8 in.' },
      { process: 'flux', metals: ['mild-steel'], maxIn: 0.375, text: 'Quick specs: MIG/flux-cored mild steel 24 ga.–3/8 in.' },
      { process: 'tig', metals: ['mild-steel'], maxIn: 0.1875, text: 'Quick specs: DC TIG mild steel 22 ga.–3/16 in.' },
      { process: 'stick', metals: ['mild-steel'], maxIn: 0.375, text: 'Quick specs: stick mild steel 16 ga.–3/8 in.' },
    ],
    processes: field('MIG, flux-cored, DC TIG, and stick.', MH200S, 'Quick specs and the opening paragraph'),
    output: field('MIG/flux-cored: 30–200 A. DC TIG: 20–200 A. Stick: 30–200 A. The table narrows 120 V MIG to 30–120 A, 120 V TIG to 20–140 A, and 120 V stick to 30–100 A.', MH200S, 'Quick specs and the specifications table'),
    duty: field('At 30% duty cycle: MIG 110 A at 19.5 V on 120 V and 165 A at 22.2 V on 240 V; DC TIG 105 A at 14.2 V on 120 V and 165 A at 16.6 V on 240 V; stick 90 A at 23.6 V on 120 V and 140 A at 25.6 V on 240 V.', MH200S, 'Specifications table, rated output at 30% duty cycle'),
    input: field('120 V or 240 V, 50/60 Hz. MVP plugs: 5-15P (120 V, 15 A) and 6-50P (240 V, 50 A). Amps input at rated output, MIG: 23.0 A at 120 V and 19.0 A at 240 V. DC TIG: 16.7 A and 14.7 A. Stick: 22.0 A and 17.9 A.', MH200S, 'Includes list and the specifications table'),
    wire: field('Quick Select drive roll for .024 in. (0.6 mm) or .030/.035 in. (0.8/0.9 mm) solid wire, and .030/.035 in. (0.8/0.9 mm) flux-cored wire. Wire feed speed on the product page is 60–650 ipm.', MH200S, 'Includes list'),
    weight: field('38.4 lb on the product page. The spec sheet says the machine weighs under 39 pounds.', MH200P, 'Product page specifications, Net Weight'),
    thickness: field('Mild steel: MIG/flux-cored 24 ga.–3/8 in., DC TIG 22 ga.–3/16 in., stick 16 ga.–3/8 in.', MH200S, 'Quick specs, Mild Steel Thickness Range'),
    productUrl: MH200P,
    searchQuery: 'Hobart Multi-Handler 200 welder',
    summary: 'Dual-voltage MIG, flux-cored, DC TIG, and stick welder. Hobart’s 30% duty-cycle row is 165 A MIG on 240 V.',
    notes: ['The stick footnote says the machine is not recommended for 6010 electrodes. TIG is DC.'],
  },
  {
    slug: 'power-mig-215-mpi',
    brand: 'Lincoln Electric',
    brandSlug: 'lincoln-electric',
    name: 'Power MIG 215 MPi',
    sku: 'K4876-1',
    procs: ['mig', 'flux', 'stick', 'tig'],
    namedMetals: [],
    acTig: false,
    voltages: [120, 240],
    weightLb: 48,
    draws: [
      { voltage: 120, inputA: 22 },
      { voltage: 240, inputA: 29 },
    ],
    caps: [],
    processes: field('MIG, flux-cored, DC stick, and DC TIG.', L215, 'Publication E7.70, processes line and the multi-process feature'),
    output: field('120 V: 20–140 A DC. 230 V: 20–220 A DC. Max OCV 56 V.', L215, 'Product specifications, output range'),
    duty: field('215 A / 24.8 V / 30%. The specifications table prints that one duty-cycle figure beside input power 120/230/1/60. 215 A is above the printed 120 V output range of 20–140 A.', L215, 'Product specifications, rated output'),
    input: field('120/230/1/60. Input current at rated output: 120 VAC, 15 A effective and 22 A max; 230 VAC, 15.9 A effective and 29 A max.', L215, 'Product specifications, input current'),
    wire: field('Wire feed speed 50–500 ipm (1.3–12.7 m/min). A wire-diameter range is not in the specifications table.', L215, 'Product specifications, wire feed speed'),
    weight: field('48 lb (21.8 kg).', L215, 'Product specifications, net weight, and the 48 lb feature line'),
    thickness: missing(L215, 'Publication E7.70 does not print a material thickness.'),
    productUrl: L215,
    searchQuery: 'Lincoln Power MIG 215 MPi welder',
    summary: '120/230 V multi-process welder, K4876-1. Lincoln’s E7.70 sheet publishes 215 A at 24.8 V, 30% duty cycle, and a 48 lb weight.',
    notes: ['TIG on this sheet is DC. The 30% duty-cycle figure is not labeled with a voltage. The 120 V output range stops at 140 A.'],
  },
  {
    slug: 'square-wave-tig-200',
    brand: 'Lincoln Electric',
    brandSlug: 'lincoln-electric',
    name: 'Square Wave TIG 200',
    sku: 'K5126-1',
    procs: ['tig', 'stick'],
    namedMetals: ['aluminum'],
    acTig: true,
    voltages: [120, 240],
    weightLb: 46,
    draws: [
      { voltage: 120, inputA: 21 },
      { voltage: 240, inputA: 25 },
    ],
    caps: [],
    processes: field('AC/DC TIG and stick.', L200, 'Publication E3.38.1, processes line'),
    output: field('120 V: TIG 10–125 A and stick 10–90 A. 230 V: TIG 10–200 A and stick 10–170 A. A footnote prints 120 V AC TIG 110 A / 25%.', L200, 'Specifications table, output range'),
    duty: field('120 V TIG: 125 A/25%, 100 A/40%, 85 A/60%. 120 V stick: 75 A/20%, 65 A/60%. 230 V TIG: 200 A/25%, 160 A/40%, 130 A/60%. 230 V stick: 170 A/20%, 100 A/60%.', L200, 'Specifications table, rated output'),
    input: field('120/1/50/60 and 230/1/50/60. Input current at those rated outputs runs from 14 A to 21 A on 120 V and from 13 A to 25 A on 230 V. The highest 120 V figure is 21 A and the highest 230 V figure is 25 A. 120/230 V input cords are included.', L200, 'Specifications table, input current, and What’s Included'),
    wire: missing(L200, 'The specifications table does not print a tungsten or stick-electrode diameter range.'),
    weight: field('46 lb (21 kg). Dimensions 14 x 10.75 x 19.25 in.', L200, 'Specifications table, net weight'),
    thickness: missing(L200, 'Publication E3.38.1 does not print a material thickness.'),
    productUrl: L200,
    searchQuery: 'Lincoln Square Wave TIG 200 welder',
    summary: 'AC/DC TIG and stick welder, K5126-1. Lincoln publishes 200 A TIG at 25% duty cycle on 230 V and a 46 lb weight.',
    notes: ['The brief calls it a TIG machine for aluminum and describes high-frequency starting for aluminum. It does not name a steel thickness.'],
  },
  {
    slug: 'power-mig-260',
    brand: 'Lincoln Electric',
    brandSlug: 'lincoln-electric',
    name: 'Power MIG 260',
    sku: 'K3520-1',
    procs: ['mig', 'flux'],
    namedMetals: ['aluminum'],
    acTig: false,
    voltages: [240],
    weightLb: 247,
    draws: [{ voltage: 240, inputA: 55 }],
    caps: [],
    processes: field('MIG and flux-cored.', L260, 'Publication E7.56.2, processes line'),
    output: field('30–300 A. Wire feed speed 50–700 ipm (1.3–17.7 m/min).', L260, 'Specifications table, output range and wire feed speed'),
    duty: field('250 A / 26.5 V / 40%.', L260, 'Specifications table, rated output'),
    input: field('208/230/460/575 V, 1-phase, 60 Hz. Input current at rated output: 59/55/27/21 A in that voltage order. The 230 V figure is 55 A. This check treats that 230 V figure as the 240 V outlet class.', L260, 'Specifications table, input power and input current'),
    wire: missing(L260, 'The specifications table does not print a wire-diameter range.'),
    weight: field('247 lb (112 kg). Dimensions 37.3 x 18 x 40.4 in.', L260, 'Specifications table, weight'),
    thickness: missing(L260, 'Publication E7.56.2 does not print a material thickness.'),
    productUrl: L260,
    searchQuery: 'Lincoln Power MIG 260 welder',
    summary: '230 V class MIG and flux-cored welder, K3520-1. Lincoln publishes 250 A at 26.5 V, 40% duty cycle.',
    notes: ['Push-pull aluminum performance is named. No aluminum thickness is printed. 120 V is not an input on this sheet.'],
  },
  {
    slug: 'power-mig-210-mp',
    brand: 'Lincoln Electric',
    brandSlug: 'lincoln-electric',
    name: 'Power MIG 210 MP',
    sku: 'K3963-1',
    procs: ['mig', 'flux', 'stick', 'tig'],
    namedMetals: ['mild-steel'],
    acTig: false,
    voltages: [120, 240],
    weightLb: 40,
    draws: [
      { voltage: 120, inputA: 15 },
      { voltage: 240, inputA: 14.7 },
    ],
    caps: [],
    processes: field('MIG, stick, TIG, and flux-cored. The rated-output column is labeled MIG.', L210, 'Publication E7.50, opening description and the specifications header'),
    output: field('120 V: 20–140 A DC, max OCV 56. 230 V: 20–220 A DC, max OCV 56. Wire feed speed 50–500 ipm (1.3–12.7 m/min).', L210, 'Product specifications, output range'),
    duty: field('MIG: 120 V, 100 A / 19.0 V / 40%. 230 V, 200 A / 24 V / 25%.', L210, 'Product specifications, rated output, current/voltage/duty cycle (MIG)'),
    input: field('120/1/60 and 230/1/60. Effective input current at rated output: 15 A at 120 V and 14.7 A at 230 V. 120 V and 230 V input cables are included with K3963-1.', L210, 'Product specifications and the included-accessories table'),
    wire: field('Included drive rolls are 0.025–0.030 in. (0.6–0.8 mm) and 0.035 in. (0.9 mm), plus 0.030–0.045 in. (0.8–1.1 mm) knurled drive rolls. The specifications table itself does not print a wire-capacity range.', L210, 'Included accessories table, drive rolls'),
    weight: field('40 lb (18 kg).', L210, 'Product specifications, net weight, and the 40 lb feature line'),
    thickness: missing(L210, 'Publication E7.50 does not print a material thickness.'),
    productUrl: L210,
    searchQuery: 'Lincoln Power MIG 210 MP welder',
    summary: '120/230 V multi-process welder, K3963-1. Lincoln’s E7.50 sheet publishes MIG duty of 200 A at 24 V, 25% on 230 V.',
    notes: [
      'A sample spool of SuperArc L-56 mild steel MIG wire is listed as included. That is the mild-steel name used here.',
      'Stick and TIG duty cycles are not in the MIG rated-output column of this sheet.',
    ],
  },
  {
    slug: 'rebel-emp-215ic',
    brand: 'ESAB',
    brandSlug: 'esab',
    name: 'Rebel EMP 215ic',
    procs: ['mig', 'flux', 'stick', 'tig'],
    namedMetals: ['mild-steel', 'stainless', 'aluminum'],
    acTig: false,
    voltages: [120, 240],
    weightLb: 42,
    draws: [
      { voltage: 120, process: 'mig', onBreakerA: 15, inputA: 20.8, maxTimeDelayA: 30, maxNormalFuseA: 50 },
      { voltage: 120, process: 'mig', onBreakerA: 20, inputA: 28.6, maxTimeDelayA: 30, maxNormalFuseA: 50 },
      { voltage: 120, process: 'flux', onBreakerA: 15, inputA: 20.8, maxTimeDelayA: 30, maxNormalFuseA: 50 },
      { voltage: 120, process: 'flux', onBreakerA: 20, inputA: 28.6, maxTimeDelayA: 30, maxNormalFuseA: 50 },
      { voltage: 120, process: 'tig', onBreakerA: 15, inputA: 20.8, maxTimeDelayA: 30, maxNormalFuseA: 50 },
      { voltage: 120, process: 'stick', onBreakerA: 15, inputA: 20.8, maxTimeDelayA: 30, maxNormalFuseA: 50 },
      { voltage: 240, process: 'mig', inputA: 30, maxTimeDelayA: 30, maxNormalFuseA: 50 },
      { voltage: 240, process: 'flux', inputA: 30, maxTimeDelayA: 30, maxNormalFuseA: 50 },
      { voltage: 240, process: 'tig', inputA: 19, maxTimeDelayA: 30, maxNormalFuseA: 50 },
      { voltage: 240, process: 'stick', inputA: 25, maxTimeDelayA: 30, maxNormalFuseA: 50 },
    ],
    caps: [],
    processes: field('GMAW (MIG), GTAW (TIG), and SMAW (stick). Flux-cored wire is listed in the wire-diameter table.', E215, 'Manual 0463 789 001, technical data and section 5.2'),
    output: field('MIG setting range: 15 A / 14.75 V to 130 A / 20.5 V on 120 V, and to 235 A / 26.0 V on 230 V. TIG: 5 A to 130 A on 120 V and to 200 A on 230 V. Stick: 6 A to 130 A on 120 V and 16 A to 180 A on 230 V.', E215, 'Technical data, setting range'),
    duty: field('MIG, 230 V: 205 A / 24.25 V at 25% and 235 A / 26 V at 15%. MIG, 120 V, 20 A breaker: 130 A / 20.5 V at 20%. TIG, 230 V: 180 A / 17.2 V at 30%. Stick, 230 V: 180 A / 27.2 V at 25%. The table prints more duty points at 40%, 60%, and 100%.', E215, 'Technical data, permissible load'),
    input: field('120 V or 230 V, 1-phase, 50/60 Hz, ±10%. Imax MIG: 20.8 A on a 15 A breaker and 28.6 A on a 20 A breaker at 120 V; 30 A at 230 V (27.6 A at 25% duty cycle). The installation guide’s maximum recommended time-delay fuse or breaker is 30 A, and the maximum normal fuse is 50 A, for both supply voltages. Input current at maximum output in that guide is 30 A.', E215, 'Technical data, primary current, and section 4.3.1'),
    wire: field('Mild steel solid wire .023–.035 in. (0.6–0.9 mm). Stainless solid wire .030–.035 in. (0.8–0.9 mm). Flux-cored wire .030–.045 in. (0.8–1.1 mm). Aluminum .030–3/64 in. (0.8–1.2 mm). Spool size 4–8 in.', E215, 'Technical data, wire diameter'),
    weight: field('42 lb (19.1 kg). Dimensions 23 × 9 × 16 in.', E215, 'Technical data, weight'),
    thickness: missing(E215, 'The technical-data chapter does not print a plate thickness.'),
    productUrl: 'https://esab.com/us/nam_en/products-solutions/product/rebel-emp-215ic/',
    searchQuery: 'ESAB Rebel EMP 215ic welder',
    summary: '120/230 V MIG, TIG, and stick welder. ESAB’s manual rates MIG to 205 A at 25% duty cycle on 230 V.',
    notes: ['The manual’s 120 V output table is split by a 15 A breaker and a 20 A breaker. TIG in this manual is DC.'],
  },
  {
    slug: 'rebel-emp-235ic',
    brand: 'ESAB',
    brandSlug: 'esab',
    name: 'Rebel EMP 235ic',
    sku: '0558012702',
    procs: ['mig', 'flux', 'stick', 'tig'],
    namedMetals: ['mild-steel', 'stainless', 'aluminum'],
    acTig: false,
    voltages: [120, 240],
    weightLb: 63,
    draws: [],
    caps: [
      { process: 'mig', metals: [], maxIn: 0.5, text: 'Specifications: maximum plate thickness 1/2 in. (12.7 mm). The cell is not split by process.' },
      { process: 'flux', metals: [], maxIn: 0.5, text: 'Specifications: maximum plate thickness 1/2 in. (12.7 mm).' },
      { process: 'stick', metals: [], maxIn: 0.5, text: 'Specifications: maximum plate thickness 1/2 in. (12.7 mm).' },
      { process: 'tig', metals: [], maxIn: 0.5, text: 'Specifications: maximum plate thickness 1/2 in. (12.7 mm).' },
    ],
    processes: field('MIG, TIG, and stick. The wire table includes flux-cored diameters in the ordering copy: up to .052 in. cored wire.', E235, 'Brochure introduction and the wire-diameter table'),
    output: field('Current range 5–150 A on 120 V and 5–250 A on 230 V. Maximum output 250 A / 30 V.', E235, 'Specifications, current range and maximum output'),
    duty: field('At 104°F (40°C): MIG 120 A / 19 V at 40% on 120 V and 235 A / 26 V at 40% on 230 V. Stick 90 A / 23.6 V at 40% on 120 V and 210 A / 28.4 V at 25% on 230 V. TIG 130 A / 15.2 V at 40% on 120 V and 240 A / 19.6 V at 40% on 230 V.', E235, 'Specifications, welding output'),
    input: field('Primary voltage 120 VAC and 208/230 VAC, 1-phase, 50/60 Hz. Supply range 90–270 VAC. Supply plug 230 V, NEMA 6-50P. A separate accessory is a 230 V to 120 V, 15 A power adapter (W4014000). Input amperes are not in the specifications table.', E235, 'Specifications and the accessories list'),
    wire: field('Mild steel .023–.035 in. (0.6–0.9 mm). Stainless .030–.035 in. (0.8–0.9 mm). Aluminum .030–.045 in. (0.8–1.2 mm). The introduction also says up to .045 in. solid wire, up to .052 in. cored wire, rods up to 5/32 in., and TIG rods up to 3/16 in. Spools 4, 8, and 12 in.', E235, 'Specifications, wire diameter, and the introduction'),
    weight: field('Specifications table: 63 lb (28.6 kg). The same brochure’s introduction says “weighing in at 53 lbs. (24 kg).”', E235, 'Specifications, power source weight, and the introduction'),
    thickness: field('Maximum plate thickness 1/2 in. (12.7 mm).', E235, 'Specifications, maximum plate thickness'),
    productUrl: 'https://esab.com/us/nam_en/products-solutions/product/welding-equipment/multi-process-welders/rebel-emp-235ic/',
    searchQuery: 'ESAB Rebel EMP 235ic welder',
    summary: '120/230 V MIG, TIG, and stick welder. ESAB’s brochure rates MIG at 235 A, 40% duty cycle on 230 V.',
    notes: ['The job check uses the 63 lb specifications-table weight. The 53 lb sentence is kept in the weight cell because it is on the same brochure.'],
  },
  {
    slug: 'tig225x',
    brand: 'PrimeWeld',
    brandSlug: 'primeweld',
    name: 'TIG225X',
    procs: ['tig', 'stick'],
    namedMetals: ['mild-steel', 'stainless', 'aluminum'],
    acTig: true,
    voltages: [120, 240],
    weightLb: 41,
    draws: [],
    caps: [
      { process: 'tig', metals: [], maxIn: 0.5, text: 'The product page says the machine can weld materials up to 1/2 inch thick. It does not name the process or the metal for that sentence.' },
      { process: 'stick', metals: [], maxIn: 0.5, text: 'The 1/2 inch sentence is not limited to one process on the page.' },
    ],
    processes: field('AC/DC TIG and stick. The page tells the operator to use AC for aluminum and magnesium and DC for steel, stainless, and most other metals.', P225, 'Specifications, output range, and the AC/DC selector instructions'),
    output: field('TIG 10–225 A. Stick 10–180 A.', P225, 'Specifications, output range'),
    duty: field('TIG: 40% at max output, and 100% at 108 A on 120 V or 155 A on 240 V. Stick: 40% at max output, and 100% at 76 A on 120 V or 139 A on 240 V.', P225, 'Specifications, duty cycle'),
    input: field('120 V / 240 V, single-phase, 50/60 Hz. Input amperes and a plug name are not in the specifications list.', P225, 'Specifications, input voltage'),
    wire: missing(P225, 'The specifications list does not print a tungsten or electrode diameter range. Included collets are accessories, not a rated range.'),
    weight: field('41 lb (18.5 kg).', P225, 'Specifications, weight'),
    thickness: field('The page says it can weld materials up to 1/2 inch thick.', P225, 'Product description above the specifications list'),
    productUrl: P225,
    searchQuery: 'PrimeWeld TIG225X welder',
    summary: '120/240 V AC/DC TIG and stick welder. PrimeWeld publishes a 10–225 A TIG range and a 41 lb weight.',
    notes: ['AC waveforms listed: square, sine, and triangle.'],
  },
  {
    slug: 'tig325x',
    brand: 'PrimeWeld',
    brandSlug: 'primeweld',
    name: 'TIG325X',
    procs: ['tig', 'stick'],
    namedMetals: [],
    acTig: true,
    voltages: [120, 240],
    weightLb: 73.24,
    draws: [],
    caps: [],
    processes: field('AC/DC TIG and stick. The output line splits TIG into 5–325 A DC and 10–325 A AC.', P325, 'Specifications, output range'),
    output: field('TIG 10–325 A (5–325 A DC, 10–325 A AC). Stick 20–250 A.', P325, 'Specifications, output range'),
    duty: field('TIG: 40% at 325 A, 60% at 280 A, 100% at 250 A. Stick: 40% at 250 A, 60% at 220 A, 100% at 180 A. The duty lines are not split by voltage.', P325, 'Specifications, duty cycle'),
    input: field('120 V / 240 V, single-phase, 50/60 Hz. Input amperes are not in the specifications list.', P325, 'Specifications, input voltage'),
    wire: missing(P325, 'The specifications list does not print a tungsten or electrode diameter range.'),
    weight: field('73.24 lb (about 33.2 kg).', P325, 'Specifications, weight'),
    thickness: missing(P325, 'The specifications list does not print a material thickness.'),
    productUrl: P325,
    searchQuery: 'PrimeWeld TIG325X welder',
    summary: '120/240 V AC/DC TIG and stick welder. PrimeWeld publishes 325 A TIG at 40% duty cycle.',
    notes: ['The page prints the kilogram weight with an approximation sign. The pound figure is 73.24.'],
  },
  {
    slug: 'tig230',
    brand: 'PrimeWeld',
    brandSlug: 'primeweld',
    name: 'TIG230',
    procs: ['tig', 'stick'],
    namedMetals: [],
    acTig: true,
    voltages: [120, 240],
    weightLb: 46,
    draws: [],
    caps: [],
    processes: field('AC/DC TIG and stick. The page lists nine AC waveforms, including square, sine, triangle, and hybrid.', P230, 'Specifications block, output range and AC waveforms'),
    output: field('TIG 2–230 A. Stick 10–200 A.', P230, 'Specifications block, output range'),
    duty: field('TIG: 35% at 230 A, 60% at 175 A, 100% at 136 A. Stick: 35% at 200 A, 60% at 152 A, 100% at 118 A. The duty lines are not split by voltage.', P230, 'Specifications block, duty cycle'),
    input: field('90–275 V, 50–60 Hz. That range covers a 120 V outlet and a 240 V outlet. Input amperes are not in the specifications block.', P230, 'Specifications block, input voltage'),
    wire: missing(P230, 'The specifications block does not print a tungsten or electrode diameter range.'),
    weight: field('46 lb. Dimensions 22 in. long, 8 in. wide, 16 in. high.', P230, 'Specifications block, weight and dimensions'),
    thickness: missing(P230, 'The specifications block does not print a material thickness.'),
    productUrl: P230,
    searchQuery: 'PrimeWeld TIG230 welder',
    summary: 'AC/DC TIG and stick welder with a 90–275 V input. PrimeWeld publishes 230 A TIG at 35% duty cycle.',
    notes: ['AC balance is printed as 25–50% and AC frequency as 50–250 Hz.'],
  },
  {
    slug: 'mig285',
    brand: 'PrimeWeld',
    brandSlug: 'primeweld',
    name: 'MIG285',
    procs: ['mig', 'flux', 'tig', 'stick'],
    namedMetals: [],
    acTig: false,
    voltages: [120, 240],
    draws: [
      { voltage: 120, process: 'mig', inputA: 34.2 },
      { voltage: 240, process: 'mig', inputA: 57.4 },
      { voltage: 120, process: 'stick', inputA: 42.5 },
      { voltage: 240, process: 'stick', inputA: 53.5 },
      { voltage: 120, process: 'tig', inputA: 25.3 },
      { voltage: 240, process: 'tig', inputA: 35.7 },
    ],
    caps: [
      { process: 'mig', metals: [], maxIn: 0.625, text: 'The overview ties 285 A, the MIG maximum, to materials up to 5/8 inch thick. It does not name the metal.' },
    ],
    processes: field('The specifications table says output type MIG, lift TIG, and stick. The overview also names flux core.', P285, 'Specifications table, output type, and the four-process overview'),
    output: field('Max rated output: MIG 285 A, TIG 250 A, stick 250 A. The duty table prints MIG 285 A on 240 V and 120 A on 120 V, and stick and TIG 250 A on 240 V and 120 A on 120 V.', P285, 'Specifications table, max rated output and duty rows'),
    duty: field('MIG: 30% at 285 A on 240 V and 30% at 120 A on 120 V. Stick: 30% at 250 A on 240 V and 30% at 120 A on 120 V. TIG: 30% at 250 A on 240 V and 30% at 120 A on 120 V.', P285, 'Specifications table, amps at rated duty cycle'),
    input: field('1-phase, 120 V/240 V. Max inrush (I1max), columns MIG / stick / TIG: 120 V 34.2 / 42.5 / 25.3 A, and 240 V 57.4 / 53.5 / 35.7 A. Max rated (I1eff): 120 V 18.7 / 23.3 / 13.9 A, and 240 V 27.4 / 29.3 / 19.6 A.', P285, 'Specifications table, input amps'),
    wire: missing(P285, 'The specifications table does not print a wire-diameter range.'),
    weight: field('The page says “weighing under 60 lbs.” It does not print a single net-weight number.', P285, 'Product overview, weight sentence'),
    thickness: field('The overview says the 285 A output can weld materials up to 5/8 inch thick.', P285, 'Product overview'),
    productUrl: P285,
    searchQuery: 'PrimeWeld MIG285 welder',
    summary: '120/240 V MIG, lift TIG, and stick welder, with flux-cored named in the overview. PrimeWeld’s duty table is 30% at the max amp rating.',
    notes: ['The job check uses I1max, the inrush column, because that is the larger input current the table prints. I1eff is quoted in the input cell.'],
  },
  {
    slug: 'tig200',
    brand: 'PrimeWeld',
    brandSlug: 'primeweld',
    name: 'TIG200',
    procs: ['tig', 'stick'],
    namedMetals: ['mild-steel'],
    acTig: false,
    voltages: [120, 240],
    draws: [],
    caps: [
      { process: 'tig', metals: ['mild-steel'], voltage: 240, maxIn: 0.4375, singlePass: true, text: 'The page says 190 A on 240 V is enough to weld 7/16-inch steel in a single pass. It does not print a multi-pass maximum.' },
    ],
    processes: field('DC TIG and stick.', P200, 'Product description, “200 amp DC TIG and stick arc welder”'),
    output: field('On 240 V: TIG 190 A and stick 185 A. On 120 V: TIG 145 A and stick 140 A. The lower limit is 10 A for either process.', P200, 'Product description, output sentences'),
    duty: missing(P200, 'The product description that states the amp figures does not print a duty cycle.'),
    input: field('Dual-voltage 120/240 V input. Input amperes are not in that description.', P200, 'Product description, input sentence'),
    wire: missing(P200, 'The description does not print a tungsten or electrode diameter range.'),
    weight: missing(P200, 'The description that states the amp figures does not print a net weight.'),
    thickness: field('7/16-inch steel in a single pass is tied to the 190 A, 240 V TIG sentence. The 10 A floor is described as mild enough for 24-gauge sheet metal. A 120 V thickness is not printed.', P200, 'Product description'),
    productUrl: P200,
    searchQuery: 'PrimeWeld TIG200 welder',
    summary: 'DC TIG and stick welder on 120/240 V. PrimeWeld’s page says 190 A TIG on 240 V and 7/16-inch steel in a single pass.',
    notes: ['These amp figures are in the product description, not in a separate specifications table on the same page.'],
  },
  {
    slug: 'unlimited-200',
    brand: 'Harbor Freight',
    brandSlug: 'harbor-freight',
    name: 'Unlimited 200',
    sku: '57862',
    procs: ['mig', 'flux', 'stick', 'tig'],
    namedMetals: [],
    acTig: false,
    voltages: [120, 240],
    draws: [
      { voltage: 120, process: 'mig', inputA: 23 },
      { voltage: 240, process: 'mig', inputA: 32 },
      { voltage: 120, process: 'flux', inputA: 23 },
      { voltage: 240, process: 'flux', inputA: 32 },
      { voltage: 120, process: 'stick', inputA: 22 },
      { voltage: 240, process: 'stick', inputA: 31 },
      { voltage: 120, process: 'tig', inputA: 18 },
      { voltage: 240, process: 'tig', inputA: 26 },
    ],
    caps: [],
    processes: field('GMAW/FCAW, SMAW, and GTAW.', HF200, 'Owner’s manual item 57862, specifications, current input and welding current range'),
    output: field('120 V: GMAW/FCAW 30–140 A, SMAW 15–70 A, GTAW 15–90 A. 240 V: GMAW/FCAW 30–200 A, SMAW 15–170 A, GTAW 15–200 A.', HF200, 'Specifications, welding current range'),
    duty: field('120 V: GMAW/FCAW 40% at 90 A, SMAW 40% at 70 A, GTAW 40% at 90 A. 240 V: GMAW/FCAW 15% at 200 A, SMAW 15% at 170 A, GTAW 15% at 200 A.', HF200, 'Specifications, rated duty cycle'),
    input: field('120/240 VAC, 60 Hz. Current input at 120 V: GMAW/FCAW 23 A, SMAW 22 A, GTAW 18 A. At 240 V: 32 A, 31 A, and 26 A.', HF200, 'Specifications, power input and current input'),
    wire: field('Solid core .025 / .030 / .035 in. Flux-cored .030 / .035 in. Wire speed 80–400 IPM. Spool capacity up to 12 lb.', HF200, 'Specifications, welding wire capacity'),
    weight: missing(HF200, 'The specifications block does not print a machine weight.'),
    thickness: missing(HF200, 'The specifications block does not print a material thickness.'),
    productUrl: HF200,
    searchQuery: 'Harbor Freight Unlimited 200 welder 57862',
    summary: 'Harbor Freight item 57862, a 120/240 V multi-process welder. The manual rates 200 A MIG at 15% duty cycle on 240 V.',
    notes: ['A second Harbor Freight manual for item 57862, file 57862-193175424426.pdf, prints different input-current figures. The cells on this page follow 57862-193175459367.pdf only.'],
  },
  {
    slug: 'unlimited-140',
    brand: 'Harbor Freight',
    brandSlug: 'harbor-freight',
    name: 'Unlimited 140',
    sku: '58828',
    procs: ['mig', 'flux', 'stick', 'tig'],
    namedMetals: [],
    acTig: false,
    voltages: [120],
    draws: [
      { voltage: 120, process: 'mig', inputA: 21 },
      { voltage: 120, process: 'flux', inputA: 21 },
      { voltage: 120, process: 'stick', inputA: 21.3 },
      { voltage: 120, process: 'tig', inputA: 20.5 },
    ],
    caps: [],
    processes: field('GMAW/FCAW, SMAW, and GTAW.', HF140, 'Owner’s manual item 58828, specifications'),
    output: field('GMAW/FCAW 30–140 A. SMAW 30–75 A. GTAW 20–110 A.', HF140, 'Specifications, welding current range'),
    duty: field('GMAW/FCAW 30% at 90 A. SMAW 40% at 75 A. GTAW 20% at 110 A.', HF140, 'Specifications, rated duty cycle'),
    input: field('120 VAC / 60 Hz. Current input: GMAW/FCAW 21 A, SMAW 21.3 A, GTAW 20.5 A.', HF140, 'Specifications, power input and current input'),
    wire: field('Solid core .025 / .030 / .035 in. Flux-cored .030 / .035 in. Wire speed 80–275 IPM. Spool capacity up to 12 lb.', HF140, 'Specifications, welding wire capacity'),
    weight: missing(HF140, 'The specifications block does not print a machine weight.'),
    thickness: missing(HF140, 'The specifications block does not print a material thickness.'),
    productUrl: HF140,
    searchQuery: 'Harbor Freight Unlimited 140 welder 58828',
    summary: 'Harbor Freight item 58828, a 120 V multi-process welder. The manual rates MIG/flux-cored at 30% duty cycle at 90 A.',
    notes: ['Open-circuit voltage in this manual is 69 VDC.'],
  },
];

export function getModel(slug: string): Model | undefined {
  return models.find((m) => m.slug === slug);
}

export function brands(): { slug: string; name: string; count: number }[] {
  const map = new Map<string, { slug: string; name: string; count: number }>();
  for (const m of models) {
    const row = map.get(m.brandSlug) ?? { slug: m.brandSlug, name: m.brand, count: 0 };
    row.count += 1;
    map.set(m.brandSlug, row);
  }
  return [...map.values()];
}

export function modelPath(m: Model): string {
  return `/models/${m.slug}/`;
}

export function steelMax(m: Model, voltage: Volt): number | null {
  const caps = m.caps.filter(
    (c) =>
      c.maxIn != null &&
      (c.metals.length === 0 || c.metals.includes('mild-steel')) &&
      (c.voltage == null || c.voltage === voltage) &&
      (c.process === 'mig' || c.process === 'flux' || c.process === 'stick' || c.process === 'tig'),
  );
  const specific = caps.filter((c) => c.voltage === voltage);
  const pool = specific.length ? specific : caps.filter((c) => c.voltage == null);
  if (!pool.length) return null;
  return Math.max(...pool.map((c) => c.maxIn as number));
}

export type Pair = { slug: string; a: Model; b: Model };

function shares<T>(a: T[], b: T[]): boolean {
  return a.some((item) => b.includes(item));
}

/** Alternatives that share a process and a voltage. Other combinations are not pages. */
export function pairs(): Pair[] {
  const index = new Map(models.map((m, i) => [m.slug, i]));
  const out: Pair[] = [];
  const seen = new Set<string>();
  for (const [left, right] of PUBLISHED_PAIRS) {
    const ia = index.get(left);
    const ib = index.get(right);
    if (ia == null || ib == null) throw new Error(`Unknown comparison slug: ${left} vs ${right}`);
    const a = models[Math.min(ia, ib)];
    const b = models[Math.max(ia, ib)];
    if (!shares(a.procs, b.procs) || !shares(a.voltages, b.voltages)) {
      throw new Error(`${a.slug} vs ${b.slug} does not share a process and a voltage`);
    }
    const slug = `${a.slug}-vs-${b.slug}`;
    if (seen.has(slug)) throw new Error(`Duplicate comparison ${slug}`);
    seen.add(slug);
    out.push({ slug, a, b });
  }
  return out;
}

export function getPair(slug: string): Pair | undefined {
  return pairs().find((p) => p.slug === slug);
}

