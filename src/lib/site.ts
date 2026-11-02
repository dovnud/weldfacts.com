export const SITE = {
  name: 'WeldFacts.com',
  url: 'https://weldfacts.com',
  email: 'contact@weldfacts.com',
  tagline: 'Welder specs from the manufacturer sheet',
  checked: '2026-11-02',
  publisher: 'WeldFacts',
} as const;

export function abs(path: string): string {
  return SITE.url + path;
}
