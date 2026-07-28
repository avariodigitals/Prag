import type { Product } from '@/lib/types';

type ParsedPower = {
  value: number;
  unitRank: number;
};

export type SortableProduct = Pick<Product, 'name'> & {
  price?: string;
  attributes?: { id: number; name: string; options: string[] }[];
};

const POWER_REGEX = /(\d+(?:\.\d+)?)\s*(kva|kw)\b/gi;

function parsePower(product: SortableProduct): ParsedPower | null {
  const text = [
    product.name,
    ...(product.attributes?.map((attr) => `${attr.name} ${attr.options.join(' ')}`) ?? []),
  ].join(' ');

  const matches = Array.from(text.matchAll(POWER_REGEX));
  if (!matches.length) return null;

  const parsed = matches
    .map((m) => {
      const value = Number(m[1]);
      const unit = String(m[2] ?? '').toLowerCase();
      if (!Number.isFinite(value) || value <= 0) return null;
      return {
        value,
        unitRank: unit === 'kw' ? 0 : 1,
      };
    })
    .filter((item): item is ParsedPower => item !== null)
    .sort((a, b) => (a.value - b.value) || (a.unitRank - b.unitRank));

  return parsed[0] ?? null;
}

function parsePrice(price?: string): number {
  const numeric = Number(String(price ?? '').replace(/,/g, ''));
  return Number.isFinite(numeric) && numeric > 0 ? numeric : Number.POSITIVE_INFINITY;
}

export function compareProductsBySizeThenPrice(a: SortableProduct, b: SortableProduct): number {
  const ap = parsePower(a);
  const bp = parsePower(b);

  if (ap && bp) {
    if (ap.value !== bp.value) return ap.value - bp.value;
    if (ap.unitRank !== bp.unitRank) return ap.unitRank - bp.unitRank;
  } else if (ap && !bp) {
    return -1;
  } else if (!ap && bp) {
    return 1;
  }

  const priceDiff = parsePrice(a.price) - parsePrice(b.price);
  if (priceDiff !== 0) return priceDiff;

  return a.name.localeCompare(b.name, undefined, { sensitivity: 'base' });
}

export function sortProductsBySizeThenPrice<T extends SortableProduct>(items: T[]): T[] {
  return [...items].sort(compareProductsBySizeThenPrice);
}
