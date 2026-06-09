import { useEffect, useRef, useState } from 'react';
import type { FontItem, FontPerformance } from '../types/font';
import { buildFontCssUrl, weightsFromVariants } from '../utils/cssGenerator';
import { useFontStore } from '../store/useFontStore';

const loadedPromises = new Map<string, Promise<FontPerformance>>();
const appendedLinks = new Set<string>();

interface ResourceMetrics {
  transferBytes: number;
  durationMs: number;
  gstaticHit: boolean;
}

const MIN_FONT_BYTES = 30 * 1024;

function collectResourceMetrics(family: string, cssUrl: string): ResourceMetrics {
  const slug = family.toLowerCase().replace(/\s+/g, '');
  let totalBytes = 0;
  let maxDuration = 0;
  let gstaticHit = false;

  try {
    const allEntries = performance.getEntriesByType('resource');
    for (const entry of allEntries) {
      const name = entry.name;
      const isGstatic = name.includes('fonts.gstatic.com');
      const matchesGstatic =
        isGstatic &&
        (name.includes(slug) || name.includes(family.replace(/\s+/g, '')));
      const matchesCss =
        name.includes('fonts.googleapis.com/css2') &&
        (name.includes(family.replace(/\s+/g, '+')) ||
          name.includes(slug) ||
          cssUrl.includes(name) ||
          name.includes(cssUrl.slice(cssUrl.indexOf('family='))));
      if (!matchesGstatic && !matchesCss) continue;
      if (matchesGstatic) gstaticHit = true;

      const timing = entry as PerformanceResourceTiming;
      const size = timing.transferSize > 0
        ? timing.transferSize
        : timing.encodedBodySize > 0
          ? timing.encodedBodySize
          : 0;
      const dur = timing.duration > 0 ? timing.duration : 0;
      totalBytes += size;
      if (dur > maxDuration) maxDuration = dur;
    }

    const perfNames: PerformanceEntry[] = [];
    try {
      const cssEntries = performance.getEntriesByName(cssUrl);
      perfNames.push(...cssEntries);
    } catch { /* empty */ }

    if (perfNames.length === 0) {
      const urlBase = cssUrl.split('&')[0];
      const allRes = performance.getEntriesByType('resource');
      for (const r of allRes) {
        if (r.name.startsWith(urlBase) || r.name.includes('family=' + slug)) {
          perfNames.push(r);
        }
      }
    }

    for (const entry of perfNames) {
      const timing = entry as PerformanceResourceTiming;
      const size = timing.transferSize > 0
        ? timing.transferSize
        : timing.encodedBodySize > 0
          ? timing.encodedBodySize
          : 0;
      const dur = timing.duration > 0 ? timing.duration : 0;
      if (size > totalBytes) totalBytes = size;
      if (dur > maxDuration) maxDuration = dur;
    }
  } catch {
    /* ignore */
  }

  return { transferBytes: totalBytes, durationMs: maxDuration, gstaticHit };
}

async function waitForResourceTiming(
  family: string,
  cssUrl: string,
  timeoutMs: number,
): Promise<ResourceMetrics> {
  const started = performance.now();
  const pollInterval = 80;
  let last: ResourceMetrics = { transferBytes: 0, durationMs: 0, gstaticHit: false };

  while (performance.now() - started < timeoutMs) {
    const metrics = collectResourceMetrics(family, cssUrl);
    if (metrics.gstaticHit || metrics.transferBytes >= MIN_FONT_BYTES) {
      return metrics;
    }
    if (metrics.transferBytes > last.transferBytes) last = metrics;
    await new Promise((r) => setTimeout(r, pollInterval));
  }
  return last;
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

    const fallbackMs = Math.round(performance.now() - start);
    const variantCount = font.variants.length;

    let fileSizeKb = 0;
    let loadTimeMs = fallbackMs;
    try {
      const weightsKey = (useWeights ?? []).slice().sort((a, b) => a - b).join('-');
      const sizeKey = `__fsize_${font.family}::${weightsKey}`;
      const cached = sessionStorage.getItem(sizeKey);
      if (cached) {
        try {
          const parsed = JSON.parse(cached) as { kb: number; dur: number };
          fileSizeKb = parsed.kb || 0;
          if (parsed.dur && parsed.dur > 0) loadTimeMs = parsed.dur;
        } catch {
          fileSizeKb = parseInt(cached, 10) || 0;
        }
      } else {
        const metrics = await waitForResourceTiming(font.family, cssUrl, 1500);
        if (metrics.transferBytes >= MIN_FONT_BYTES || metrics.gstaticHit) {
          fileSizeKb = Math.round(metrics.transferBytes / 1024);
        }
        if (metrics.durationMs > 0) {
          loadTimeMs = Math.max(loadTimeMs, Math.round(metrics.durationMs));
        }
        if (fileSizeKb > 0 || loadTimeMs > 0) {
          sessionStorage.setItem(
            sizeKey,
            JSON.stringify({ kb: fileSizeKb, dur: loadTimeMs }),
          );
        }
      }
    } catch {
      fileSizeKb = 0;
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
