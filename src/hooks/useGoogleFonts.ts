import { useEffect, useState } from 'react';
import type { FontItem } from '../types/font';
import { FONT_DATASET, buildFiles, getVersion } from '../data/fonts';
import { loadFontCache, saveFontCache } from '../utils/storage';
import { useFontStore } from '../store/useFontStore';

const GOOGLE_FONTS_API =
  'https://www.googleapis.com/webfonts/v1/webfonts?sort=popularity&key=';

export function useGoogleFonts(apiKey?: string) {
  const setFonts = useFontStore((s) => s.setFonts);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        if (apiKey) {
          try {
            const cached = loadFontCache(apiKey) as FontItem[] | null;
            if (cached && Array.isArray(cached) && cached.length > 0) {
              setFonts(cached);
              setLoading(false);
              return;
            }
            const res = await fetch(`${GOOGLE_FONTS_API}${apiKey}`);
            if (res.ok) {
              const json = (await res.json()) as { items: FontItem[] };
              const items = json.items ?? [];
              const enriched: FontItem[] = items.map((f, i) => {
                const version = f.version || getVersion(f.family);
                const rawFiles =
                  f.files && typeof f.files === 'object' && Object.keys(f.files).length > 0
                    ? f.files
                    : buildFiles(f.family, f.variants, version);
                return {
                  ...f,
                  version,
                  files: rawFiles,
                  popularity: Math.max(1, 100 - i),
                };
              });
              saveFontCache(enriched, apiKey);
              if (!cancelled) {
                setFonts(enriched);
                setLoading(false);
                return;
              }
            }
          } catch (e) {
            console.warn('Google Fonts API failed, using built-in dataset', e);
          }
        }
        if (!cancelled) {
          setFonts(FONT_DATASET);
          setLoading(false);
        }
      } catch (e) {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : 'Unknown error');
          setFonts(FONT_DATASET);
          setLoading(false);
        }
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [apiKey, setFonts]);

  return { loading, error };
}
