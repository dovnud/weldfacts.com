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

export { modelFaqs } from './guide.ts';

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
