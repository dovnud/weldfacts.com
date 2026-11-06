import { SITE } from './site.ts';

export function ldEscape(data: unknown): string {
  return JSON.stringify(data).replace(/</g, '\\u003c');
}

export function crumbLd(crumbs: { name: string; path: string }[]) {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: [{ name: 'Home', path: '/' }, ...crumbs].map((c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: c.name,
      item: SITE.url + c.path,
    })),
  };
}

export function webPageLd(name: string, path: string, description: string, checked: string) {
  return {
    '@type': 'WebPage',
    name,
    url: SITE.url + path,
    description,
    dateModified: `${checked}T00:00:00Z`,
    isPartOf: { '@type': 'WebSite', name: SITE.name, url: SITE.url + '/' },
    publisher: { '@type': 'Organization', name: SITE.publisher, url: SITE.url + '/' },
  };
}

export function websiteLd(description: string) {
  return {
    '@type': 'WebSite',
    name: SITE.name,
    url: SITE.url + '/',
    description,
    publisher: { '@type': 'Organization', name: SITE.publisher, url: SITE.url + '/', email: SITE.email },
  };
}

export function orgLd() {
  return {
    '@type': 'Organization',
    name: SITE.publisher,
    url: SITE.url + '/',
    email: SITE.email,
  };
}

export function graph(nodes: Record<string, unknown>[]) {
  return { '@context': 'https://schema.org', '@graph': nodes };
}
