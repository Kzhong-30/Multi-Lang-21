import { CATEGORY_LABELS, type FontCategory } from '../../types/font';
import { useFontStore } from '../../store/useFontStore';
import { cn } from '../../lib/utils';

const CATEGORIES: Array<FontCategory | 'all'> = [
  'all',
  'sans-serif',
  'serif',
  'handwriting',
  'monospace',
  'display',
];

const LABELS: Record<string, string> = {
  all: '全部',
  ...CATEGORY_LABELS,
};

export function CategoryFilter() {
  const active = useFontStore((s) => s.activeCategory);
  const setActive = useFontStore((s) => s.setActiveCategory);

  return (
    <div className="flex flex-wrap gap-2">
      {CATEGORIES.map((c) => (
        <button
          key={c}
          onClick={() => setActive(c)}
          className={cn(
            'rounded-full border px-3 py-1 text-xs transition',
            active === c
              ? 'border-accent bg-accent text-white shadow-[0_0_20px_rgba(232,114,58,0.25)]'
              : 'border-zinc-800 bg-zinc-900/40 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200',
          )}
        >
          {LABELS[c]}
        </button>
      ))}
    </div>
  );
}
