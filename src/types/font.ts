export type FontCategory =
  | 'serif'
  | 'sans-serif'
  | 'handwriting'
  | 'monospace'
  | 'display';

export interface FontItem {
  family: string;
  category: FontCategory;
  variants: string[];
  subsets: string[];
  files: Record<string, string>;
  version: string;
  lastModified: string;
  popularity?: number;
}

export interface StyleParams {
  fontSize: number;
  fontWeight: number;
  lineHeight: number;
  letterSpacing: number;
  previewText: string;
}

export interface FontPair {
  id: string;
  fontA: FontItem;
  fontB: FontItem | null;
  styleA: StyleParams;
  styleB: StyleParams;
  savedAt: number;
  name?: string;
}

export interface FontPerformance {
  family: string;
  loadTimeMs: number;
  fileSizeKb: number;
  variantCount: number;
  loadedAt: number;
}

export const CATEGORY_LABELS: Record<FontCategory, string> = {
  serif: '衬线',
  'sans-serif': '无衬线',
  handwriting: '手写',
  monospace: '等宽',
  display: '展示',
};

export const DEFAULT_PREVIEW_TEXT =
  '设计是关于如何让事物运作得更好。\nTypography is the craft of endowing human language with a durable visual form.';

export const DEFAULT_STYLE_A: StyleParams = {
  fontSize: 36,
  fontWeight: 600,
  lineHeight: 1.4,
  letterSpacing: 0,
  previewText: DEFAULT_PREVIEW_TEXT,
};

export const DEFAULT_STYLE_B: StyleParams = {
  fontSize: 18,
  fontWeight: 400,
  lineHeight: 1.7,
  letterSpacing: 0.01,
  previewText:
    '好的排版是隐形的。读者应该感受到内容本身，而不是字体的存在。\nGood typography is like bread: it should be wholesome, nourishing, and above all, digestible.',
};
