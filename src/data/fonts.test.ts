import { describe, it, expect } from 'vitest';
import {
  FONT_DATASET,
  FONT_DATASET_COUNT,
  googleFontsSlug,
  SLUG_OVERRIDES,
} from '../data/fonts';

describe('fonts.slug + buildFiles', () => {
  it('case 1: googleFontsSlug Overrides 覆盖常见多段字体名，严格匹配 Google Fonts 实际 cdn slug', () => {
    // Override 覆盖的
    expect(googleFontsSlug('Source Sans 3')).toBe(SLUG_OVERRIDES['Source Sans 3']);
    expect(googleFontsSlug('Noto Serif JP')).toBe('notoserifjp');
    expect(googleFontsSlug('IBM Plex Serif')).toBe('ibmplexserif');
    expect(googleFontsSlug('Noto Sans SC')).toBe('notosanssc');
    expect(googleFontsSlug('IBM Plex Sans Arabic')).toBe('ibmplexsansarabic');
    expect(googleFontsSlug('ZCOOL XiaoWei')).toBe('zcoolxiaowei');
    // 非 Override 的 fallback：严格删掉所有非字母数字字符再转小写
    expect(googleFontsSlug('Playfair Display')).toBe('playfairdisplay');
    expect(googleFontsSlug('Inter')).toBe('inter');
    expect(googleFontsSlug('Lora')).toBe('lora');
    expect(googleFontsSlug('DM Sans')).toBe('dmsans'); // Override
    // CJK 字符保留（Google 中文字体的 slug 也是中文名全拼，但 Unicode 字母类别包含 CJK，所以保留）
    const cjk = googleFontsSlug('马善政');
    expect(cjk.length).toBeGreaterThan(0);
    // 数字保留
    expect(googleFontsSlug('B612')).toBe('b612');
    expect(googleFontsSlug('Inter 2')).toBe('inter2');
  });

  it('case 2: FONT_DATASET 中所有字体的 files 字段为空对象，不生成假 404 直链', () => {
    expect(FONT_DATASET_COUNT).toBeGreaterThanOrEqual(500);
    for (const font of FONT_DATASET) {
      expect(Object.keys(font.files)).toHaveLength(0);
      expect(font.family.length).toBeGreaterThan(0);
      expect(['sans-serif', 'serif', 'monospace', 'handwriting', 'display']).toContain(font.category);
      expect(font.variants.length).toBeGreaterThan(0);
      expect(font.version.startsWith('v')).toBe(true);
      expect(typeof font.popularity).toBe('number');
      expect(font.popularity).toBeGreaterThanOrEqual(1);
    }
  });

  it('case 3: 分类完整性与流行度递减排序，无 Georgia-ref 等假字体', () => {
    const categories = new Set(FONT_DATASET.map((f) => f.category));
    expect(categories.has('sans-serif')).toBe(true);
    expect(categories.has('serif')).toBe(true);
    expect(categories.has('monospace')).toBe(true);
    expect(categories.has('handwriting')).toBe(true);
    expect(categories.has('display')).toBe(true);

    // 假字体不存在
    const families = new Set(FONT_DATASET.map((f) => f.family));
    expect(families.has('Georgia-ref')).toBe(false);
    expect(families.has('Helvetica-ref')).toBe(false);
    expect(families.has('Arial-ref')).toBe(false);
    // 真实字体必须有
    expect(families.has('Inter')).toBe(true);
    expect(families.has('Roboto')).toBe(true);
    expect(families.has('Open Sans')).toBe(true);
    expect(families.has('Playfair Display')).toBe(true);
    expect(families.has('Lora')).toBe(true);
    expect(families.has('Space Mono')).toBe(true);

    // 分类内流行度递减（前 30 款每个分类都检查）
    for (const cat of categories) {
      const list = FONT_DATASET.filter((f) => f.category === cat);
      for (let i = 1; i < Math.min(30, list.length); i++) {
        expect(list[i - 1].popularity).toBeGreaterThanOrEqual(list[i].popularity);
      }
    }
  });
});
