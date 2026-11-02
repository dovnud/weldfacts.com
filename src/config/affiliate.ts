/**
 * AFFILIATE CONFIG: the one place the Amazon Associates tracking ID lives.
 *
 * >>> SWAP POINT: change AMAZON_TAG below and every Amazon link on the site changes with it. <<<
 *
 * Rules:
 *  - Never type the tag into a page, component, or script. Call amazonSearchUrl()
 *    or amazonProductUrl().
 *  - Never show or hard-code prices.
 *  - /dp/<ASIN> links are only allowed for ASINs listed in ASINS. Each one must be
 *    checked by opening the live amazon.com product page and confirming the title
 *    names that one model. A listing that names several models is not used.
 *  - Until that check is done, every model uses a search link.
 */
export const AMAZON_TAG = 'weldfacts-20';

export const AMAZON_DOMAIN = 'www.amazon.com';

/** Shown next to every block of Amazon links. */
export const AMAZON_DISCLOSURE = 'As an Amazon Associate, WeldFacts earns from qualifying purchases.';

export const AFFILIATE_REL = 'sponsored nofollow noopener';
export const AFFILIATE_TARGET = '_blank';

/** Amazon search URL, tagged. */
export function amazonSearchUrl(query: string): string {
  const q = encodeURIComponent(query.trim().replace(/\s+/g, ' ')).replace(/%20/g, '+');
  return `https://${AMAZON_DOMAIN}/s?k=${q}&tag=${AMAZON_TAG}`;
}

export type VerifiedAsin = {
  asin: string;
  /** Product title on the amazon.com page when it was opened. */
  title: string;
  label: string;
  /** Date the live product page was fetched and the title confirmed (YYYY-MM-DD). */
  verified: string;
};

/**
 * Keyed by model slug. Empty until a live Amazon title is opened and names that one model.
 */
export const ASINS: Record<string, VerifiedAsin> = {};

/** Product URL for a verified ASIN. Throws on anything not in ASINS. */
export function amazonProductUrl(asin: string): string {
  if (!Object.values(ASINS).some((a) => a.asin === asin)) {
    throw new Error(`Unverified ASIN ${asin}: add it to ASINS only after verifying the live product page.`);
  }
  return `https://${AMAZON_DOMAIN}/dp/${asin}?tag=${AMAZON_TAG}`;
}

export function linkFor(slug: string, query: string): {
  href: string;
  kind: 'product' | 'search';
  title?: string;
  verified?: string;
} {
  const verified = ASINS[slug];
  if (verified) {
    return {
      href: amazonProductUrl(verified.asin),
      kind: 'product',
      title: verified.title,
      verified: verified.verified,
    };
  }
  return { href: amazonSearchUrl(query), kind: 'search' };
}
