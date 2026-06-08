import type { FontItem } from '../types/font';

export function buildFontCssUrl(
  fonts: Array<{ family: string; weights?: number[] }>,
): string {
  const parts = fonts.map((f) => {
    const family = f.family.replace(/\s+/g, '+');
    const weights = f.weights && f.weights.length > 0
      ? `:wght@${f.weights.sort((a, b) => a - b).join(';')}`
      : '';
    return `family=${family}${weights}`;
  });
  return `https://fonts.googleapis.com/css2?${parts.join('&')}&display=swap`;
}

export function generateImportCode(
  fonts: Array<{ family: string; weights?: number[] }>,
): string {
  const url = buildFontCssUrl(fonts);
  return `@import url('${url}');

/* Usage example */
.font-primary {
  font-family: '${fonts[0]?.family ?? 'Inter'}', sans-serif;
}${fonts[1] ? `
.font-secondary {
  font-family: '${fonts[1].family}', sans-serif;
}` : ''}`;
}

export function generateLinkCode(
  fonts: Array<{ family: string; weights?: number[] }>,
): string {
  const url = buildFontCssUrl(fonts);
  const preconnect = `<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>`;
  const link = `<link href="${url}" rel="stylesheet">`;

  const usage = fonts
    .map((f, i) => `/* ${i === 0 ? 'Primary' : 'Secondary'} */
.${i === 0 ? 'font-primary' : 'font-secondary'} {
  font-family: '${f.family}', ${i === 0 ? 'sans-serif' : 'serif'};
}`)
    .join('\n\n');

  return `${preconnect}
${link}

<style>
${usage}
</style>`;
}

export function weightsFromVariants(variants: string[]): number[] {
  const set = new Set<number>();
  variants.forEach((v) => {
    if (v === 'regular') set.add(400);
    else {
      const n = parseInt(v.replace(/\D/g, ''), 10);
      if (!Number.isNaN(n)) set.add(n);
    }
  });
  return Array.from(set).sort((a, b) => a - b);
}

export function supportsWeight(font: FontItem, weight: number): boolean {
  const weights = weightsFromVariants(font.variants);
  return weights.includes(weight);
}

export function findClosestWeight(font: FontItem, weight: number): number {
  const weights = weightsFromVariants(font.variants);
  if (weights.length === 0) return 400;
  return weights.reduce((best, w) =>
    Math.abs(w - weight) < Math.abs(best - weight) ? w : best,
  );
}
