import type { FontPair } from '../types/font';

const FAVORITES_KEY = 'font-pair-favorites-v1';
const FONT_CACHE_KEY = 'font-data-cache-v1';

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

export function loadFontCache(): unknown | null {
  try {
    const raw = localStorage.getItem(FONT_CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as FontDataCache;
    if (Date.now() - parsed.timestamp > CACHE_TTL) return null;
    return parsed.data;
  } catch {
    return null;
  }
}

export function saveFontCache(data: unknown): void {
  try {
    const payload: FontDataCache = { timestamp: Date.now(), data };
    localStorage.setItem(FONT_CACHE_KEY, JSON.stringify(payload));
  } catch (e) {
    console.warn('Failed to cache fonts', e);
  }
}
