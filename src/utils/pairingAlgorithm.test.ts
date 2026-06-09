import { describe, it, expect } from 'vitest';
import type { FontItem } from '../types/font';
import { scorePairingCandidates, type PairingScore } from './pairingAlgorithm';

function mkFont(
  family: string,
  category: FontItem['category'],
  variants: string[] = ['regular', '700'],
  popularity = 50,
): FontItem {
  return {
    family,
    category,
    variants,
    subsets: ['latin'],
    files: {},
    version: 'v1',
    lastModified: '2025-01-01',
    popularity,
  };
}

const inter = mkFont('Inter', 'sans-serif', ['300', 'regular', '500', '700'], 100);
const playfair = mkFont(
  'Playfair Display',
  'serif',
  ['regular', '500', '700', '900'],
  91,
);
const roboto = mkFont('Roboto', 'sans-serif', ['300', 'regular', '500', '700'], 99);
const robotoMono = mkFont('Roboto Mono', 'monospace', ['regular', '500', '700'], 88);
const dancing = mkFont('Dancing Script', 'handwriting', ['regular', '700'], 93);
const oswald = mkFont('Oswald', 'display', ['300', 'regular', '500', '700'], 94);
const sourceSans = mkFont(
  'Source Sans Pro',
  'sans-serif',
  ['300', 'regular', '600', '700', '900'],
  89,
);
const workSans = mkFont(
  'Work Sans',
  'sans-serif',
  ['300', 'regular', '500', '600', '700'],
  90,
);
const lora = mkFont('Lora', 'serif', ['regular', '500', '600', '700'], 92);
const caveat = mkFont('Caveat', 'handwriting', ['regular', '500', '700'], 91);

describe('scorePairingCandidates', () => {
  it('case 1: 空候选数组返回空数组', () => {
    const result = scorePairingCandidates(inter, 400, [], 400);
    expect(result).toEqual([]);
    expect(Array.isArray(result)).toBe(true);
  });

  it('case 2: 过滤掉与 baseFont 完全相同 family 的候选字体', () => {
    const dup = mkFont('Inter', 'sans-serif', ['regular'], 88);
    const candidates = [dup, playfair, roboto];
    const result = scorePairingCandidates(inter, 400, candidates, 400);
    expect(result.find((r) => r.font.family === 'Inter')).toBeUndefined();
    expect(result.length).toBe(candidates.length - 1);
  });

  it('case 3: 不同分类（互补）得分显著高于同分类', () => {
    const candidates = [playfair, roboto];
    const result = scorePairingCandidates(inter, 400, candidates, 400);
    const serif = result.find((r) => r.font.family === 'Playfair Display')!;
    const sans = result.find((r) => r.font.family === 'Roboto')!;
    expect(serif.score).toBeGreaterThan(sans.score);
    expect(serif.reasons).toEqual(
      expect.arrayContaining(['serif 与 sans-serif 互补']),
    );
  });

  it('case 4: 经典配对获得额外加分（Playfair + Inter）', () => {
    const candidates = [lora, inter, roboto];
    const result = scorePairingCandidates(playfair, 700, candidates, 400);
    const withInter = result.find((r) => r.font.family === 'Inter')!;
    expect(withInter.reasons).toEqual(
      expect.arrayContaining(['经典搭配']),
    );
  });

  it('case 5: 字重差异大的得分更高（300 diff）', () => {
    const candidates = [playfair];
    const heavy = scorePairingCandidates(inter, 300, candidates, 900);
    const light = scorePairingCandidates(inter, 400, candidates, 500);
    expect(heavy[0].score).toBeGreaterThan(light[0].score);
    expect(heavy[0].reasons).toEqual(
      expect.arrayContaining(['字重层次分明']),
    );
  });

  it('case 6: x-height 相近得分更高（Inter + Work Sans 都是 5）', () => {
    const candidates = [workSans];
    const match = scorePairingCandidates(inter, 400, candidates, 400);
    expect(match[0].reasons).toEqual(
      expect.arrayContaining(['x-height 和谐']),
    );
  });

  it('case 7: 结果按 score 降序排列', () => {
    const candidates = [playfair, roboto, robotoMono, dancing, oswald];
    const result: PairingScore[] = scorePairingCandidates(
      inter,
      400,
      candidates,
      400,
    );
    for (let i = 1; i < result.length; i++) {
      expect(result[i - 1].score).toBeGreaterThanOrEqual(result[i].score);
    }
  });

  it('case 8: 所有候选都带有正确结构（font/score/reasons），score 范围 0-1', () => {
    const candidates = [
      playfair,
      roboto,
      robotoMono,
      dancing,
      oswald,
      lora,
      sourceSans,
      caveat,
    ];
    const result = scorePairingCandidates(inter, 600, candidates, 400);
    expect(result.length).toBeGreaterThan(3);
    for (const item of result) {
      expect(typeof item.font.family).toBe('string');
      expect(typeof item.score).toBe('number');
      expect(item.score).toBeGreaterThan(0);
      expect(item.score).toBeLessThanOrEqual(1);
      expect(Array.isArray(item.reasons)).toBe(true);
      expect(item.reasons.every((r) => typeof r === 'string')).toBe(true);
    }
  });
});
