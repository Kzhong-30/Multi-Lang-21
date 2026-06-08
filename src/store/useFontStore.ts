import { create } from 'zustand';
import type {
  FontItem,
  FontPair,
  FontPerformance,
  StyleParams,
} from '../types/font';
import {
  DEFAULT_STYLE_A,
  DEFAULT_STYLE_B,
} from '../types/font';
import {
  addFavorite,
  loadFavorites,
  removeFavorite,
} from '../utils/storage';
import { findClosestWeight } from '../utils/cssGenerator';

interface FontState {
  fonts: FontItem[];
  fontA: FontItem | null;
  fontB: FontItem | null;
  styleA: StyleParams;
  styleB: StyleParams;
  compareMode: boolean;
  favorites: FontPair[];
  searchQuery: string;
  activeCategory: string;
  performanceMap: Record<string, FontPerformance>;
  showExportModal: boolean;
  showFavoritesDrawer: boolean;
  setFonts: (fonts: FontItem[]) => void;
  setFontA: (font: FontItem) => void;
  setFontB: (font: FontItem | null) => void;
  setStyleA: (patch: Partial<StyleParams>) => void;
  setStyleB: (patch: Partial<StyleParams>) => void;
  toggleCompareMode: () => void;
  setSearchQuery: (q: string) => void;
  setActiveCategory: (c: string) => void;
  saveCurrentPair: () => FontPair | null;
  deleteFavorite: (id: string) => void;
  applyFavorite: (pair: FontPair) => void;
  recordPerformance: (perf: FontPerformance) => void;
  setShowExportModal: (v: boolean) => void;
  setShowFavoritesDrawer: (v: boolean) => void;
  init: () => void;
}

function clampStyleA(style: StyleParams, font: FontItem | null): StyleParams {
  if (!font) return style;
  return {
    ...style,
    fontWeight: findClosestWeight(font, style.fontWeight),
  };
}

export const useFontStore = create<FontState>((set, get) => ({
  fonts: [],
  fontA: null,
  fontB: null,
  styleA: DEFAULT_STYLE_A,
  styleB: DEFAULT_STYLE_B,
  compareMode: false,
  favorites: [],
  searchQuery: '',
  activeCategory: 'all',
  performanceMap: {},
  showExportModal: false,
  showFavoritesDrawer: false,

  setFonts: (fonts) => {
    const currentA = get().fontA;
    const defaultA = fonts[0] ?? null;
    const defaultB = fonts[1] ?? null;
    set({
      fonts,
      fontA: currentA ?? defaultA,
      fontB: defaultB,
    });
  },

  setFontA: (font) => {
    set((s) => ({ fontA: font, styleA: clampStyleA(s.styleA, font) }));
  },

  setFontB: (font) => {
    set((s) => ({
      fontB: font,
      styleB: font ? clampStyleA(s.styleB, font) : s.styleB,
    }));
  },

  setStyleA: (patch) => {
    const font = get().fontA;
    set((s) => {
      const next = { ...s.styleA, ...patch };
      if (patch.fontWeight !== undefined && font) {
        next.fontWeight = findClosestWeight(font, patch.fontWeight);
      }
      return { styleA: next };
    });
  },

  setStyleB: (patch) => {
    const font = get().fontB;
    set((s) => {
      const next = { ...s.styleB, ...patch };
      if (patch.fontWeight !== undefined && font) {
        next.fontWeight = findClosestWeight(font, patch.fontWeight);
      }
      return { styleB: next };
    });
  },

  toggleCompareMode: () =>
    set((s) => ({ compareMode: !s.compareMode })),

  setSearchQuery: (q) => set({ searchQuery: q }),

  setActiveCategory: (c) => set({ activeCategory: c }),

  saveCurrentPair: () => {
    const { fontA, fontB, styleA, styleB, compareMode } = get();
    if (!fontA) return null;
    const pair: FontPair = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      fontA,
      fontB: compareMode ? fontB : null,
      styleA,
      styleB: compareMode ? styleB : styleA,
      savedAt: Date.now(),
    };
    const next = addFavorite(pair);
    set({ favorites: next });
    return pair;
  },

  deleteFavorite: (id) => {
    const next = removeFavorite(id);
    set({ favorites: next });
  },

  applyFavorite: (pair) => {
    set({
      fontA: pair.fontA,
      fontB: pair.fontB,
      styleA: pair.styleA,
      styleB: pair.styleB,
      compareMode: !!pair.fontB,
    });
  },

  recordPerformance: (perf) => {
    set((s) => ({
      performanceMap: { ...s.performanceMap, [perf.family]: perf },
    }));
  },

  setShowExportModal: (v) => set({ showExportModal: v }),
  setShowFavoritesDrawer: (v) => set({ showFavoritesDrawer: v }),

  init: () => {
    set({ favorites: loadFavorites() });
  },
}));
