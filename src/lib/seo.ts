const BRAND = 'WeldFacts';
const SEP = ' | ';

function htmlLen(input: string): number {
  return input.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').length;
}

function shorten(input: string, maxHtml: number): string {
  let cut = input.trim();
  while (cut.length > 12 && htmlLen(cut) > maxHtml) {
    const space = cut.lastIndexOf(' ');
    if (space < 12) break;
    cut = cut.slice(0, space);
  }
  return cut.replace(/[\s,;:|·—–&-]+$/u, '').trim();
}

export function modelHeading(brand: string, name: string): string {
  const already = name.toLowerCase().startsWith(`${brand.toLowerCase()} `) || name.toLowerCase() === brand.toLowerCase();
  return `${already ? name : `${brand} ${name}`} welder specs`;
}

export function serpTitle(input: string): string {
  const primary = input.replace(/\s+/g, ' ').trim().replace(/\s*\|\s*WeldFacts(?:\.com)?\s*$/i, '');
  const branded = `${primary}${SEP}${BRAND}`;
  if (primary.length >= 15 && htmlLen(branded) <= 60) return branded;
  const fitted = shorten(primary, 60 - htmlLen(SEP + BRAND));
  if (fitted.length >= 15 && htmlLen(`${fitted}${SEP}${BRAND}`) <= 60) return `${fitted}${SEP}${BRAND}`;
  const bare = shorten(primary, 60);
  return bare.length >= 12 ? bare : shorten(`${primary} welder specs`, 60);
}

export function metaDescription(input: string): string {
  let text = input.replace(/\s+/g, ' ').trim();
  if (htmlLen(text) > 155) {
    let cut = text;
    while (htmlLen(cut) > 150 && cut.length > 40) {
      const space = cut.lastIndexOf(' ');
      if (space < 40) break;
      cut = cut.slice(0, space);
    }
    text = cut.replace(/[\s,;:|·—–&-]+$/u, '').replace(/\.$/, '') + '.';
  }
  if (text.length < 70) text = `${text.replace(/\.$/, '')} Manufacturer citations are on each row.`;
  return text;
}

export function isoDate(input?: string): string | undefined {
  if (!input) return undefined;
  if (/^\d{4}-\d{2}-\d{2}$/.test(input)) return `${input}T00:00:00Z`;
  return input;
}

export function checkedLabel(iso: string): string {
  const [y, m, d] = iso.split('-').map(Number);
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  return `${d} ${months[m - 1]} ${y}`;
}
