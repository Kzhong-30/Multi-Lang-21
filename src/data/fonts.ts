import type { FontCategory, FontItem } from '../types/font';

interface RawFont {
  family: string;
  category: FontCategory;
  variants: string[];
  popularity?: number;
}

const RAW_FONTS: RawFont[] = [
  { family: 'Inter', category: 'sans-serif', variants: ['100','200','300','regular','500','600','700','800','900'], popularity: 100 },
  { family: 'Roboto', category: 'sans-serif', variants: ['100','300','regular','500','700','900'], popularity: 99 },
  { family: 'Open Sans', category: 'sans-serif', variants: ['300','regular','500','600','700','800'], popularity: 98 },
  { family: 'Lato', category: 'sans-serif', variants: ['100','300','regular','700','900'], popularity: 97 },
  { family: 'Montserrat', category: 'sans-serif', variants: ['100','200','300','regular','500','600','700','800','900'], popularity: 96 },
  { family: 'Poppins', category: 'sans-serif', variants: ['100','200','300','regular','500','600','700','800','900'], popularity: 95 },
  { family: 'Work Sans', category: 'sans-serif', variants: ['100','200','300','regular','500','600','700','800','900'], popularity: 90 },
  { family: 'Source Sans Pro', category: 'sans-serif', variants: ['200','300','regular','600','700','900'], popularity: 89 },
  { family: 'Raleway', category: 'sans-serif', variants: ['100','200','300','regular','500','600','700','800','900'], popularity: 88 },
  { family: 'Nunito', category: 'sans-serif', variants: ['200','300','regular','600','700','800','900'], popularity: 87 },
  { family: 'Noto Sans', category: 'sans-serif', variants: ['100','300','regular','500','700','900'], popularity: 86 },
  { family: 'DM Sans', category: 'sans-serif', variants: ['regular','500','700'], popularity: 85 },
  { family: 'Quicksand', category: 'sans-serif', variants: ['300','regular','500','600','700'], popularity: 80 },
  { family: 'Mukta', category: 'sans-serif', variants: ['200','300','regular','500','600','700','800'], popularity: 79 },
  { family: 'Fira Sans', category: 'sans-serif', variants: ['100','200','300','regular','500','600','700','800','900'], popularity: 78 },
  { family: 'Sora', category: 'sans-serif', variants: ['100','200','300','regular','500','600','700','800'], popularity: 77 },
  { family: 'Space Grotesk', category: 'sans-serif', variants: ['300','regular','500','600','700'], popularity: 76 },
  { family: 'Manrope', category: 'sans-serif', variants: ['200','300','regular','500','600','700','800'], popularity: 75 },
  { family: 'Plus Jakarta Sans', category: 'sans-serif', variants: ['200','300','regular','500','600','700','800'], popularity: 74 },
  { family: 'Outfit', category: 'sans-serif', variants: ['100','200','300','regular','500','600','700','800','900'], popularity: 73 },
  { family: 'Figtree', category: 'sans-serif', variants: ['300','regular','500','600','700','800','900'], popularity: 72 },
  { family: 'Lora', category: 'serif', variants: ['regular','500','600','700'], popularity: 92 },
  { family: 'Playfair Display', category: 'serif', variants: ['regular','500','600','700','800','900'], popularity: 91 },
  { family: 'Merriweather', category: 'serif', variants: ['300','regular','700','900'], popularity: 90 },
  { family: 'Tinos', category: 'serif', variants: ['regular','700'], popularity: 76 },
  { family: 'Roboto Slab', category: 'serif', variants: ['100','300','regular','500','700','900'], popularity: 88 },
  { family: 'Noto Serif', category: 'serif', variants: ['regular','700'], popularity: 87 },
  { family: 'Source Serif Pro', category: 'serif', variants: ['200','300','regular','600','700','900'], popularity: 86 },
  { family: 'EB Garamond', category: 'serif', variants: ['regular','500','600','700','800'], popularity: 85 },
  { family: 'Cormorant Garamond', category: 'serif', variants: ['300','regular','500','600','700'], popularity: 84 },
  { family: 'DM Serif Display', category: 'serif', variants: ['regular'], popularity: 83 },
  { family: 'Bitter', category: 'serif', variants: ['regular','500','600','700','800','900'], popularity: 82 },
  { family: 'Fraunces', category: 'serif', variants: ['100','300','regular','500','600','700','800','900'], popularity: 81 },
  { family: 'Libre Baskerville', category: 'serif', variants: ['regular','700'], popularity: 80 },
  { family: 'Vollkorn', category: 'serif', variants: ['regular','500','600','700','800','900'], popularity: 79 },
  { family: 'Crimson Pro', category: 'serif', variants: ['200','300','regular','500','600','700','800','900'], popularity: 78 },
  { family: 'PT Serif', category: 'serif', variants: ['regular','700'], popularity: 77 },
  { family: 'Abril Fatface', category: 'display', variants: ['regular'], popularity: 76 },
  { family: 'Space Mono', category: 'monospace', variants: ['regular','700'], popularity: 92 },
  { family: 'JetBrains Mono', category: 'monospace', variants: ['100','200','300','regular','500','600','700','800'], popularity: 91 },
  { family: 'IBM Plex Mono', category: 'monospace', variants: ['100','200','300','regular','500','600','700'], popularity: 90 },
  { family: 'Fira Code', category: 'monospace', variants: ['300','regular','500','600','700'], popularity: 89 },
  { family: 'Roboto Mono', category: 'monospace', variants: ['100','300','regular','500','700'], popularity: 88 },
  { family: 'Source Code Pro', category: 'monospace', variants: ['200','300','regular','500','600','700','800','900'], popularity: 87 },
  { family: 'Inconsolata', category: 'monospace', variants: ['200','300','regular','500','600','700','800','900'], popularity: 86 },
  { family: 'Cousine', category: 'monospace', variants: ['regular','700'], popularity: 85 },
  { family: 'Dancing Script', category: 'handwriting', variants: ['regular','500','600','700'], popularity: 93 },
  { family: 'Pacifico', category: 'handwriting', variants: ['regular'], popularity: 92 },
  { family: 'Caveat', category: 'handwriting', variants: ['regular','500','600','700'], popularity: 91 },
  { family: 'Shadows Into Light', category: 'handwriting', variants: ['regular'], popularity: 90 },
  { family: 'Patrick Hand', category: 'handwriting', variants: ['regular'], popularity: 89 },
  { family: 'Indie Flower', category: 'handwriting', variants: ['regular'], popularity: 88 },
  { family: 'Kalam', category: 'handwriting', variants: ['300','regular','700'], popularity: 87 },
  { family: 'Satisfy', category: 'handwriting', variants: ['regular'], popularity: 86 },
  { family: 'Great Vibes', category: 'handwriting', variants: ['regular'], popularity: 85 },
  { family: 'Oswald', category: 'display', variants: ['200','300','regular','500','600','700'], popularity: 94 },
  { family: 'Bebas Neue', category: 'display', variants: ['regular'], popularity: 93 },
  { family: 'Anton', category: 'display', variants: ['regular'], popularity: 92 },
  { family: 'Archivo Black', category: 'display', variants: ['regular'], popularity: 91 },
  { family: 'Righteous', category: 'display', variants: ['regular'], popularity: 90 },
  { family: 'Lobster', category: 'display', variants: ['regular'], popularity: 89 },
  { family: 'Bungee', category: 'display', variants: ['regular'], popularity: 88 },
  { family: 'Fugaz One', category: 'display', variants: ['regular'], popularity: 87 },
  { family: 'Major Mono Display', category: 'display', variants: ['regular'], popularity: 86 },
  { family: 'Yeseva One', category: 'display', variants: ['regular'], popularity: 85 },
];

function buildFiles(family: string, variants: string[]): Record<string, string> {
  const base = 'https://fonts.gstatic.com/s';
  const slug = family.toLowerCase().replace(/\s+/g, '');
  const files: Record<string, string> = {};
  variants.forEach((v) => {
    const weight = v === 'regular' ? '400' : v;
    const italic = weight.includes('italic');
    const w = weight.replace('italic', '');
    const suffix = italic ? '-i' : '-r';
    files[v] = `${base}/${slug}/v1/${slug}${suffix}-${w}.woff2`;
  });
  return files;
}

export const FONT_DATASET: FontItem[] = RAW_FONTS.map(
  (f) =>
    ({
      family: f.family,
      category: f.category,
      variants: f.variants,
      subsets: ['latin'],
      files: buildFiles(f.family, f.variants),
      version: 'v1',
      lastModified: '2025-01-01',
      popularity: f.popularity ?? 50,
    }) satisfies FontItem,
);
