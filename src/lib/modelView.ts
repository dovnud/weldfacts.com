import type { Model } from '../data/models';
import { modelPath } from '../data/models';
import { SITE } from './site';

export function specRows(m: Model) {
  return [
    { label: 'Process', field: m.processes },
    { label: 'Output amp range', field: m.output },
    { label: 'Rated duty cycle', field: m.duty },
    { label: 'Input voltage and plug', field: m.input },
    { label: 'Wire or rod size', field: m.wire },
    { label: 'Weight', field: m.weight },
    { label: 'Material thickness', field: m.thickness },
  ];
}

const PROC: Record<string, string> = {
  mig: 'MIG',
  flux: 'flux-cored',
  stick: 'stick',
  tig: 'TIG',
};

export function modelFaqs(m: Model) {
  return [
    {
      q: `What output does the ${m.name} publish?`,
      a: m.output.published ? `${m.output.text} Source: ${m.output.cite.url}` : `Output is not published on the page we checked: ${m.output.cite.url}`,
    },
    {
      q: `What duty cycle does the ${m.name} publish?`,
      a: m.duty.published ? `${m.duty.text} Source: ${m.duty.cite.url}` : 'Duty cycle is not published on the page we checked.',
    },
    {
      q: `What input does the ${m.name} publish?`,
      a: m.input.published ? m.input.text : 'Input voltage is not published on the page we checked.',
    },
    {
      q: `Which processes does the ${m.name} publish?`,
      a: m.procs.map((p) => PROC[p]).join(', ') + '.',
    },
  ];
}

export function productLd(m: Model) {
  return {
    '@type': 'Product',
    name: m.name,
    sku: m.sku,
    brand: { '@type': 'Brand', name: m.brand },
    url: SITE.url + modelPath(m),
    description: m.summary,
    additionalProperty: specRows(m)
      .filter((row) => row.field.published)
      .map((row) => ({
        '@type': 'PropertyValue',
        name: row.label,
        value: row.field.text,
      })),
  };
}
