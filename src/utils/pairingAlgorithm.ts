import type { FontCategory, FontItem } from '../types/font';

const CATEGORY_COMPLEMENT: Record<FontCategory, FontCategory[]> = {
  serif: ['sans-serif', 'handwriting', 'display'],
  'sans-serif': ['serif', 'handwriting', 'monospace', 'display'],
  handwriting: ['serif', 'sans-serif'],
  monospace: ['sans-serif', 'serif'],
  display: ['sans-serif', 'serif', 'monospace'],
};

const CLASSIC_PAIRINGS: Array<[string, string]> = [
  ['Playfair Display', 'Inter'],
  ['Playfair Display', 'Work Sans'],
  ['Lora', 'Work Sans'],
  ['Lora', 'Source Sans Pro'],
  ['Merriweather', 'Roboto'],
  ['Libre Baskerville', 'Source Sans Pro'],
  ['EB Garamond', 'Montserrat'],
  ['DM Serif Display', 'DM Sans'],
  ['Cormorant Garamond', 'Plus Jakarta Sans'],
  ['Fraunces', 'Manrope'],
  ['Crimson Pro', 'Inter'],
  ['Roboto Slab', 'Roboto'],
  ['PT Serif', 'Inter'],
  ['Abril Fatface', 'Roboto'],
  ['Yeseva One', 'Work Sans'],
  ['Oswald', 'Lora'],
  ['Oswald', 'Source Sans Pro'],
  ['Bebas Neue', 'Roboto'],
  ['Anton', 'Noto Sans'],
  ['Dancing Script', 'Lato'],
  ['Caveat', 'Montserrat'],
  ['Shadows Into Light', 'Open Sans'],
  ['Space Mono', 'Inter'],
  ['Space Mono', 'Work Sans'],
  ['JetBrains Mono', 'Inter'],
  ['IBM Plex Mono', 'IBM Plex Sans'],
  ['Roboto Mono', 'Roboto'],
  ['Source Code Pro', 'Source Sans Pro'],
  ['Fira Code', 'Inter'],
  ['Inconsolata', 'Lato'],
];

const X_HEIGHT_GROUP: Record<string, number> = {
  Inter: 5, WorkSans: 5, Roboto: 5, OpenSans: 5, Lato: 5,
  Montserrat: 4, Poppins: 4, Nunito: 5, DMSans: 5,
  SourceSansPro: 5, Raleway: 4, Mukta: 5, FiraSans: 5,
  Sora: 4, SpaceGrotesk: 4, Manrope: 5, PlusJakartaSans: 5,
  Outfit: 5, Figtree: 5, Quicksand: 5, NotoSans: 5,
  Lora: 4, PlayfairDisplay: 3, Merriweather: 4, RobotoSlab: 4,
  NotoSerif: 4, SourceSerifPro: 4, EBGaramond: 3,
  CormorantGaramond: 3, DMSerifDisplay: 3, Bitter: 4,
  Fraunces: 4, LibreBaskerville: 3, Vollkorn: 4, CrimsonPro: 4,
  PTSerif: 4, SpaceMono: 5, JetBrainsMono: 5, IBMPlexMono: 5,
  FiraCode: 5, RobotoMono: 5, SourceCodePro: 5, Inconsolata: 5,
  Cousine: 5, DancingScript: 2, Pacifico: 2, Caveat: 3,
  ShadowsIntoLight: 3, PatrickHand: 4, IndieFlower: 3,
  Kalam: 4, Satisfy: 2, GreatVibes: 2, Oswald: 3,
  BebasNeue: 3, Anton: 3, ArchivoBlack: 4, Righteous: 4,
  Lobster: 3, Bungee: 3, FugazOne: 3, MajorMonoDisplay: 4,
  YesevaOne: 3, AbrilFatface: 3,
};

function slug(s: string): string {
  return s.replace(/\s+/g, '');
}

function scoreCategoryComplement(a: FontCategory, b: FontCategory): number {
  if (a === b) return 0.2;
  if (CATEGORY_COMPLEMENT[a]?.includes(b)) return 1;
  return 0.5;
}

function scoreXHeightBalance(a: FontItem, b: FontItem): number {
  const xa = X_HEIGHT_GROUP[slug(a.family)] ?? 4;
  const xb = X_HEIGHT_GROUP[slug(b.family)] ?? 4;
  const diff = Math.abs(xa - xb);
  if (diff === 0) return 1;
  if (diff === 1) return 0.8;
  if (diff === 2) return 0.5;
  return 0.3;
}

function scoreClassicBonus(a: FontItem, b: FontItem): number {
  return CLASSIC_PAIRINGS.some(
    ([p, q]) =>
      (p === a.family && q === b.family) || (p === b.family && q === a.family),
  )
    ? 1
    : 0;
}

function scoreWeightDiff(weightA: number, weightB: number): number {
  const diff = Math.abs(weightA - weightB);
  if (diff >= 300) return 1;
  if (diff >= 200) return 0.7;
  if (diff >= 100) return 0.4;
  return 0.2;
}

export interface PairingScore {
  font: FontItem;
  score: number;
  reasons: string[];
}

export function scorePairingCandidates(
  baseFont: FontItem,
  baseWeight: number,
  candidates: FontItem[],
  candidateWeight: number,
): PairingScore[] {
  return candidates
    .filter((c) => c.family !== baseFont.family)
    .map((c) => {
      const reasons: string[] = [];
      const s1 = scoreCategoryComplement(baseFont.category, c.category);
      if (s1 >= 1) reasons.push(`${c.category} 与 ${baseFont.category} 互补`);
      const s2 = scoreWeightDiff(baseWeight, candidateWeight);
      if (s2 >= 1) reasons.push('字重层次分明');
      const s3 = scoreXHeightBalance(baseFont, c);
      if (s3 >= 0.8) reasons.push('x-height 和谐');
      const s4 = scoreClassicBonus(baseFont, c);
      if (s4 >= 1) reasons.push('经典搭配');
      const pop = (c.popularity ?? 50) / 100;

      const score = s1 * 0.4 + s2 * 0.25 + s3 * 0.2 + s4 * 0.1 + pop * 0.05;
      return { font: c, score: Math.round(score * 100) / 100, reasons };
    })
    .sort((a, b) => b.score - a.score);
}
