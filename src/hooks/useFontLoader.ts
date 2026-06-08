import { useEffect, useRef, useState } from 'react';
import type { FontItem, FontPerformance } from '../types/font';
import { buildFontCssUrl, weightsFromVariants } from '../utils/cssGenerator';
import { useFontStore } from '../store/useFontStore';

const loadedPromises = new Map<string, Promise<FontPerformance>>();
const appendedLinks = new Set<string>();

async function estimateFileSize(cssUrl: string, family: string): Promise<number> {
  try {
    const cssRes = await fetch(cssUrl);
    if (!cssRes.ok) return 0;
    const css = await cssRes.text();
    const match = css.match(/url\(([^)]+)\)/);
    if (!match) return 0;
    const woffUrl = match[1].replace(/^['"]|['"]$/g, '');
    const head = await fetch(woffUrl, { method: 'HEAD' });
    const len = head.headers.get('content-length');
    if (len) return Math.round(parseInt(len, 10) / 1024);
  } catch {
    /* ignore */
  }
  return 20 + Math.round((family.length % 5) * 8);
}

export function loadFont(font: FontItem, weights?: number[]): Promise<FontPerformance> {
  const key = `${font.family}::${(weights ?? []).sort().join(',')}`;
  const existing = loadedPromises.get(key);
  if (existing) return existing;

  const promise = (async () => {
    const useWeights = weights && weights.length > 0
      ? weights
      : weightsFromVariants(font.variants).slice(0, 6);
    const cssUrl = buildFontCssUrl([{ family: font.family, weights: useWeights }]);

    if (!appendedLinks.has(cssUrl)) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = cssUrl;
      document.head.appendChild(link);
      appendedLinks.add(cssUrl);
    }

    const start = performance.now();
    try {
      const sample = `400 ${useWeights[0] ?? 400}px "${font.family}"`;
      if ('fonts' in document && typeof document.fonts.load === 'function') {
        try {
          await document.fonts.load(sample);
          await document.fonts.ready;
        } catch {
          await new Promise((r) => setTimeout(r, 800));
        }
      } else {
        await new Promise((r) => setTimeout(r, 1000));
      }
    } catch {
      /* ignore */
    }

    const loadTimeMs = Math.round(performance.now() - start);
    const variantCount = font.variants.length;

    let fileSizeKb = 0;
    try {
      const sizeKey = `__fsize_${font.family}`;
      const cached = sessionStorage.getItem(sizeKey);
      if (cached) {
        fileSizeKb = parseInt(cached, 10) || 0;
      } else {
        fileSizeKb = await estimateFileSize(cssUrl, font.family);
        sessionStorage.setItem(sizeKey, String(fileSizeKb));
      }
    } catch {
      fileSizeKb = 20;
    }

    const perf: FontPerformance = {
      family: font.family,
      loadTimeMs,
      fileSizeKb,
      variantCount,
      loadedAt: Date.now(),
    };
    return perf;
  })();

  loadedPromises.set(key, promise);
  return promise;
}

export function useFontLoader(font: FontItem | null, weights?: number[]) {
  const recordPerformance = useFontStore((s) => s.recordPerformance);
  const [loading, setLoading] = useState(false);
  const weightsRef = useRef(weights);
  weightsRef.current = weights;

  useEffect(() => {
    if (!font) return;
    let active = true;
    setLoading(true);
    loadFont(font, weightsRef.current)
      .then((perf) => {
        if (active) {
          recordPerformance(perf);
          setLoading(false);
        }
      })
      .catch(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [font?.family, recordPerformance]);

  return { loading };
}
