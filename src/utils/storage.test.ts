import { describe, it, expect, beforeEach, vi } from 'vitest';
import type { FontPair, FontItem } from '../types/font';
import {
  CACHE_TTL,
  addFavorite,
  hasFavorite,
  loadFavorites,
  loadFontCache,
  removeFavorite,
  saveFavorites,
  saveFontCache,
} from './storage';

function mkFont(family: string): FontItem {
  return {
    family,
    category: 'sans-serif',
    variants: ['regular'],
    subsets: ['latin'],
    files: {},
    version: 'v1',
    lastModified: '2025-01-01',
    popularity: 50,
  };
}

function mkPair(
  a: string,
  b: string | null,
  savedAt = Date.now(),
): FontPair {
  return {
    id: `p-${Math.random().toString(36).slice(2, 8)}`,
    fontA: mkFont(a),
    fontB: b ? mkFont(b) : null,
    styleA: { fontSize: 36, fontWeight: 600, lineHeight: 1.4, letterSpacing: 0, previewText: 'a' },
    styleB: { fontSize: 18, fontWeight: 400, lineHeight: 1.7, letterSpacing: 0.01, previewText: 'b' },
    savedAt,
  };
}

describe('storage - favorites', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it('case 1: 空 localStorage 时 loadFavorites 返回空数组，不抛错', () => {
    expect(loadFavorites()).toEqual([]);
    expect(Array.isArray(loadFavorites())).toBe(true);
  });

  it('case 2: localStorage 里是损坏的 JSON 时 loadFavorites 不抛错并返回空数组', () => {
    localStorage.setItem('font-pair-favorites-v1', '{invalid json!!!');
    expect(loadFavorites()).toEqual([]);
  });

  it('case 3: localStorage 里存的不是数组时 loadFavorites 返回空数组', () => {
    localStorage.setItem('font-pair-favorites-v1', JSON.stringify({ foo: 'bar' }));
    expect(loadFavorites()).toEqual([]);
  });

  it('case 4: addFavorite / removeFavorite / saveFavorites 正常工作并持久化', () => {
    const p1 = mkPair('Inter', 'Playfair Display');
    const p2 = mkPair('Roboto', 'Lora');

    // 初始空
    expect(loadFavorites()).toEqual([]);

    // 加 p1
    const afterAdd1 = addFavorite(p1);
    expect(afterAdd1).toHaveLength(1);
    expect(afterAdd1[0].id).toBe(p1.id);
    // 最前面是最新的
    const afterAdd2 = addFavorite(p2);
    expect(afterAdd2).toHaveLength(2);
    expect(afterAdd2[0].id).toBe(p2.id);
    expect(afterAdd2[1].id).toBe(p1.id);
    // 持久化
    expect(loadFavorites().map((p) => p.id)).toEqual([p2.id, p1.id]);

    // 删除 p1
    const afterRm = removeFavorite(p1.id);
    expect(afterRm.map((p) => p.id)).toEqual([p2.id]);
    expect(loadFavorites().map((p) => p.id)).toEqual([p2.id]);

    // saveFavorites 覆盖
    const fresh: FontPair[] = [mkPair('A', 'B')];
    saveFavorites(fresh);
    expect(loadFavorites()).toHaveLength(1);
    expect(loadFavorites()[0].fontA.family).toBe('A');

    // 二次 addFavorite 在最新位置（push 到开头）
    const p3 = mkPair('X', null);
    const afterAdd3 = addFavorite(p3);
    expect(afterAdd3[0].id).toBe(p3.id);
    expect(afterAdd3[0].fontB).toBeNull();
  });

  it('case 5: hasFavorite 精准匹配 A-only 和 A+B，注意区分', () => {
    const onlyA = mkPair('Inter', null);
    const withB = mkPair('Inter', 'Playfair Display');
    addFavorite(onlyA);
    addFavorite(withB);

    // A-only：传入 null 才匹配
    expect(hasFavorite('Inter', null)).toBe(true);
    expect(hasFavorite('Inter', 'Playfair Display')).toBe(true);
    expect(hasFavorite('Inter', 'Lora')).toBe(false);
    expect(hasFavorite('Roboto', null)).toBe(false);
    expect(hasFavorite('Roboto', 'Lora')).toBe(false);

    // 删除 onlyA 后 hasFavorite('Inter', null) 应为 false
    removeFavorite(onlyA.id);
    expect(hasFavorite('Inter', null)).toBe(false);
    expect(hasFavorite('Inter', 'Playfair Display')).toBe(true);

    // 删除 withB 后全部 false
    removeFavorite(withB.id);
    expect(hasFavorite('Inter', null)).toBe(false);
    expect(hasFavorite('Inter', 'Playfair Display')).toBe(false);
  });

  it('case 6: localStorage quota 不足时 saveFavorites 静默失败不抛错', () => {
    const spy = vi
      .spyOn(Storage.prototype, 'setItem')
      .mockImplementation(() => {
        throw new Error('QuotaExceededError');
      });
    const p = mkPair('A', 'B');
    expect(() => saveFavorites([p])).not.toThrow();
    spy.mockRestore();
  });
});

describe('storage - font cache', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it('case 7: 空缓存返回 null，坏 JSON 返回 null', () => {
    expect(loadFontCache()).toBeNull();
    localStorage.setItem('font-data-cache-v1', '{broken');
    expect(loadFontCache()).toBeNull();
  });

  it('case 8: 24 小时内缓存有效，过期自动失效返回 null', () => {
    const fakeNow = Date.now();
    const data = [{ family: 'Inter' }];

    // 1 小时前的缓存：有效
    vi.useFakeTimers().setSystemTime(fakeNow - 60 * 60 * 1000);
    saveFontCache(data);
    vi.useFakeTimers().setSystemTime(fakeNow);
    expect(loadFontCache()).toEqual(data);

    // 25 小时前的缓存：过期
    vi.useFakeTimers().setSystemTime(fakeNow - (CACHE_TTL + 1000));
    saveFontCache({ deep: 'value' });
    vi.useFakeTimers().setSystemTime(fakeNow);
    expect(loadFontCache()).toBeNull();

    vi.useRealTimers();
  });

  it('case 9: saveFontCache 能正确保存复杂对象（多层嵌套）', () => {
    const complex = {
      items: [
        { family: 'Inter', variants: [400, 700], nested: { a: 1, b: ['x', 'y'] } },
        { family: 'Lora' },
      ],
      meta: { fetchedAt: 12345, source: 'google' },
    };
    saveFontCache(complex);
    expect(loadFontCache()).toEqual(complex);
  });

  it('case 10: saveFontCache 在 setItem 抛错时静默失败不抛错', () => {
    const spy = vi
      .spyOn(Storage.prototype, 'setItem')
      .mockImplementation(() => {
        throw new Error('QuotaExceededError');
      });
    expect(() => saveFontCache({ a: 1 })).not.toThrow();
    spy.mockRestore();
  });
});
