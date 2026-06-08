import { Type } from 'lucide-react';
import { useFontStore } from '../../store/useFontStore';
import { cn } from '../../lib/utils';

interface Props {
  which: 'A' | 'B';
}

export function TextInput({ which }: Props) {
  const styleA = useFontStore((s) => s.styleA);
  const styleB = useFontStore((s) => s.styleB);
  const setStyleA = useFontStore((s) => s.setStyleA);
  const setStyleB = useFontStore((s) => s.setStyleB);

  const value = which === 'A' ? styleA.previewText : styleB.previewText;
  const setter = which === 'A' ? setStyleA : setStyleB;

  return (
    <div>
      <label className="mb-1.5 flex items-center gap-1.5 text-[11px] uppercase tracking-wider text-zinc-500">
        <Type className="h-3 w-3" />
        预览文本 · {which}
      </label>
      <textarea
        value={value}
        onChange={(e) => setter({ previewText: e.target.value })}
        rows={2}
        className={cn(
          'w-full resize-none rounded-md border bg-zinc-900/60 px-3 py-2 text-[13px] text-zinc-100 outline-none transition placeholder:text-zinc-600 focus:bg-zinc-900',
          which === 'A'
            ? 'border-zinc-800 focus:border-accent/70'
            : 'border-zinc-800 focus:border-mint/70',
        )}
      />
    </div>
  );
}
