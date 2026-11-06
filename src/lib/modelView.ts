import { modelPath, type Model } from '../data/models.ts';
import { modelFaqs } from './guide.ts';
import { crumbLd, webPageLd } from './ld.ts';

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

export { modelFaqs };

/**
 * Model pages are WebPage documents. A Product snippet needs an offer, a review,
 * or an aggregate rating, and an offer needs a real price. This catalog has no
 * price, availability, or review, so the pages do not declare a product entity.
 */
export function modelPageLd(m: Model, checked: string) {
  const path = modelPath(m);
  const crumbs = [
    { name: 'Models', path: '/models/' },
    { name: m.name, path },
  ];
  return [
    webPageLd(`${m.name} specs`, path, m.summary, checked),
    crumbLd(crumbs),
    {
      '@type': 'FAQPage',
      mainEntity: modelFaqs(m).map((f) => ({
        '@type': 'Question',
        name: f.q,
        acceptedAnswer: { '@type': 'Answer', text: f.a },
      })),
    },
  ];
}
