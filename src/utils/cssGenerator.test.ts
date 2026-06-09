import { describe, it, expect } from 'vitest';
import type { FontItem } from '../types/font';
import {
  buildFontCssUrl,
  generateImportCode,
  generateLinkCode,
  weightsFromVariants,
  supportsWeight,
  findClosestWeight,
} from './cssGenerator';

function mkFont(variants: string[]): FontItem {
  return {
    family: 'X',
    category: 'sans-serif',
    variants,
    subsets: ['latin'],
    files: {},
    version: 'v1',
    lastModified: '2025-01-01',
  };
}

describe('cssGenerator', () => {
  it('case 1: buildFontCssUrl 单字体无 weights，family 空格转 +，附带 display=swap', () => {
    const url = buildFontCssUrl([{ family: 'Open Sans' }]);
    expect(url).toContain('https://fonts.googleapis.com/css2?');
    expect(url).toContain('family=Open+Sans');
    expect(url).toContain('display=swap');
    expect(url).not.toContain(':wght@');
  });

  it('case 2: buildFontCssUrl 带 weights，升序排序，多 font 用 & 分隔', () => {
    const url = buildFontCssUrl([
      { family: 'Inter', weights: [700, 400, 500] },
      { family: 'Lora', weights: [400, 700] },
    ]);
    expect(url).toContain('family=Inter:wght@400;500;700');
    expect(url).toContain('family=Lora:wght@400;700');
    const parts = url.split('?')[1].split('&');
    const idxInter = parts.findIndex((p) => p.startsWith('family=Inter'));
    const idxLora = parts.findIndex((p) => p.startsWith('family=Lora'));
    expect(idxInter).toBeLessThan(idxLora);
  });

  it('case 3: generateImportCode 包含 @import 与主/副字体 class 示例', () => {
    const code = generateImportCode([
      { family: 'Inter', weights: [400, 700] },
      { family: 'Playfair Display', weights: [400, 700] },
    ]);
    expect(code).toContain("@import url('https://fonts.googleapis.com/css2");
    expect(code).toContain('.font-primary');
    expect(code).toContain("font-family: 'Inter'");
    expect(code).toContain('.font-secondary');
    expect(code).toContain("font-family: 'Playfair Display'");
  });

  it('case 4: generateLinkCode 包含两个 preconnect（crossorigin）、link、style usage 示例', () => {
    const code = generateLinkCode([
      { family: 'Inter', weights: [400, 700] },
      { family: 'Lora', weights: [400] },
    ]);
    expect(code).toContain(
      '<link rel="preconnect" href="https://fonts.googleapis.com">',
    );
    expect(code).toContain(
      '<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>',
    );
    expect(code).toContain('<link href="https://fonts.googleapis.com/css2');
    expect(code).toContain('<style>');
    expect(code).toContain('.font-primary');
    expect(code).toContain('.font-secondary');
    // Primary = sans-serif fallback，Secondary = serif fallback
    expect(code).toContain("'Inter', sans-serif");
    expect(code).toContain("'Lora', serif");
  });

  it('case 5: weightsFromVariants 转换 regular→400，去重，升序排序，忽略非数字', () => {
    expect(weightsFromVariants(['regular', '500', 'regular', '700', '300'])).toEqual([300, 400, 500, 700]);
    expect(weightsFromVariants(['regular'])).toEqual([400]);
    expect(weightsFromVariants([])).toEqual([]);
    expect(weightsFromVariants(['abc', 'regular', '--'])).toEqual([400]);
    expect(weightsFromVariants(['100italic', 'regular', '700italic'])).toEqual([100, 400, 700]);
  });

  it('case 6: supportsWeight 判断字重存在性', () => {
    const font = mkFont(['300', 'regular', '600', '700']);
    expect(supportsWeight(font, 400)).toBe(true); // regular
    expect(supportsWeight(font, 300)).toBe(true);
    expect(supportsWeight(font, 700)).toBe(true);
    expect(supportsWeight(font, 500)).toBe(false);
    expect(supportsWeight(font, 900)).toBe(false);
  });

  it('case 7: findClosestWeight 找最近字重，空变体回退 400', () => {
    const font = mkFont(['100', '400', '900']);
    expect(findClosestWeight(font, 500)).toBe(400);
    expect(findClosestWeight(font, 600)).toBe(400); // 400/600 同距选小
    expect(findClosestWeight(font, 950)).toBe(900);
    expect(findClosestWeight(font, 50)).toBe(100);
    expect(findClosestWeight(mkFont([]), 600)).toBe(400);
  });
});
