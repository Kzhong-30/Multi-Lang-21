import { CATEGORY_LABELS } from '../../types/font';
import type { FontItem } from '../../types/font';
import { useFontLoader } from '../../hooks/useFontLoader';
import { useFontStore } from '../../store/useFontStore';
import { cn } from '../../lib/utils';

interface Props {
  font: FontItem;
  target: 'A' | 'B';
}

export function FontItem({ font, target }: Props) {
  const fontA = useFontStore((s) => s.fontA);
  const fontB = useFontStore((s) => s.fontB);
  const setFontA = useFontStore((s) => s.setFontA);
  const setFontB = useFontStore((s) => s.setFontB);
  const compareMode = useFontStore((s) => s.compareMode);

  useFontLoader(font, [400, 700]);

  const effectiveTarget: 'A' | 'B' =
    target === 'A'
      ? 'A'
      : compareMode
        ? 'B'
        : 'A';

  const isSelectedA = fontA?.family === font.family;
  const isSelectedB = !!compareMode && fontB?.family === font.family;
  const isSelected =
    effectiveTarget === 'A' ? isSelectedA : isSelectedB;

  const handleClick = () => {
    if (effectiveTarget === 'A') setFontA(font);
    else setFontB(font);
  };

  return (
    <button
      onClick={handleClick}
      className={cn(
        'group relative w-full overflow-hidden rounded-md border px-3 py-2.5 text-left transition-all duration-200',
        isSelected
          ? 'border-accent/70 bg-zinc-900'
          : 'border-transparent bg-zinc-900/30 hover:border-zinc-800 hover:bg-zinc-900/70',
      )}
    >
      {isSelected && (
        <span
          className={cn(
            'absolute left-0 top-0 h-full w-1',
            effectiveTarget === 'A' ? 'bg-accent' : 'bg-mint',
          )}
        />
      )}
      <div className="flex items-center justify-between gap-2">
        <span className="truncate text-[13px] font-medium text-zinc-100">
          {font.family}
        </span>
        <span className="shrink-0 rounded bg-zinc-800/70 px-1.5 py-0.5 text-[10px] uppercase tracking-wide text-zinc-400">
          {CATEGORY_LABELS[font.category]}
        </span>
      </div>
      <div
        className="mt-1.5 truncate text-[15px] leading-tight text-zinc-300"
        style={{ fontFamily: `'${font.family}', ${font.category}` }}
      >
        Hamburg QWERTY quiche
      </div>
    </button>
  );
}
