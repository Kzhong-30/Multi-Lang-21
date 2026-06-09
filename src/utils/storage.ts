import type { FontPair } from '../types/font';

const FAVORITES_KEY = 'font-pair-favorites-v1';
const FONT_CACHE_KEY = 'font-data-cache-v1';

function shortHash(input: string): string {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return (h >>> 0).toString(16).padStart(8, '0').slice(0, 8);
}

function fontCacheKeyFor(apiKey: string | undefined | null): string {
  if (!apiKey) return `${FONT_CACHE_KEY}-fallback`;
  return `${FONT_CACHE_KEY}-k${shortHash(apiKey)}`;
}

export { fontCacheKeyFor, shortHash };

export function loadFavorites(): FontPair[] {
  try {
    const raw = localStorage.getItem(FAVORITES_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as FontPair[];
    if (!Array.isArray(parsed)) return [];
    return parsed;
  } catch {
    return [];
  }
}

export function saveFavorites(favorites: FontPair[]): void {
  try {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
  } catch (e) {
    console.warn('Failed to save favorites', e);
  }
}

export function addFavorite(pair: FontPair): FontPair[] {
  const list = loadFavorites();
  const next = [pair, ...list];
  saveFavorites(next);
  return next;
}

export function removeFavorite(id: string): FontPair[] {
  const list = loadFavorites();
  const next = list.filter((p) => p.id !== id);
  saveFavorites(next);
  return next;
}

export function hasFavorite(fontAFamily: string, fontBFamily: string | null): boolean {
  const list = loadFavorites();
  return list.some((p) => {
    const aMatch = p.fontA.family === fontAFamily;
    const bMatch = fontBFamily
      ? p.fontB?.family === fontBFamily
      : p.fontB === null;
    return aMatch && bMatch;
  });
}

interface FontDataCache {
  timestamp: number;
  data: unknown;
}

export const CACHE_TTL = 24 * 60 * 60 * 1000;

export function loadFontCache(apiKey?: string | null): unknown | null {
  try {
    const raw = localStorage.getItem(fontCacheKeyFor(apiKey));
    if (!raw) return null;
    const parsed = JSON.parse(raw) as FontDataCache;
    if (Date.now() - parsed.timestamp > CACHE_TTL) return null;
    return parsed.data;
  } catch {
    return null;
  }
}

export function saveFontCache(data: unknown, apiKey?: string | null): void {
  try {
    const payload: FontDataCache = { timestamp: Date.now(), data };
    localStorage.setItem(fontCacheKeyFor(apiKey), JSON.stringify(payload));
  } catch (e) {
    console.warn('Failed to cache fonts', e);
  }
}
