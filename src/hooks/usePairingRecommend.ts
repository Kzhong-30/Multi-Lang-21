import { useMemo } from 'react';
import type { FontItem } from '../types/font';
import { scorePairingCandidates, type PairingScore } from '../utils/pairingAlgorithm';
import { useFontStore } from '../store/useFontStore';

export function usePairingRecommend(font: FontItem | null, limit = 8): PairingScore[] {
  const fonts = useFontStore((s) => s.fonts);
  const styleAWeight = useFontStore((s) => s.styleA.fontWeight);
  const styleBWeight = useFontStore((s) => s.styleB.fontWeight);

  return useMemo(() => {
    if (!font || fonts.length === 0) return [];
    const candidates = fonts;
    const scored = scorePairingCandidates(
      font,
      styleAWeight,
      candidates,
      styleBWeight,
    );
    return scored.slice(0, limit);
  }, [font?.family, fonts, styleAWeight, styleBWeight, limit]);
}
