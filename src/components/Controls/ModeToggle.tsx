import { useFontStore } from '../../store/useFontStore';
import { Columns, Columns2 } from 'lucide-react';
import { cn } from '../../lib/utils';

export function ModeToggle() {
  const compareMode = useFontStore((s) => s.compareMode);
  const toggle = useFontStore((s) => s.toggleCompareMode);

  return (
    <button
      onClick={toggle}
      className={cn(
        'flex items-center gap-2 rounded-md border px-3 py-2 text-xs transition',
        compareMode
          ? 'border-mint/60 bg-mint/10 text-mint shadow-[0_0_16px_rgba(74,158,125,0.18)]'
          : 'border-zinc-800 bg-zinc-900/60 text-zinc-300 hover:border-zinc-700 hover:text-zinc-100',
      )}
      title="切换单栏/双栏对比"
    >
      {compareMode ? (
        <>
          <Columns2 className="h-3.5 w-3.5" />
          对比模式
        </>
      ) : (
        <>
          <Columns className="h-3.5 w-3.5" />
          单栏模式
        </>
      )}
    </button>
  );
}
