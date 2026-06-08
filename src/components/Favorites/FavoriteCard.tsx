import { CATEGORY_LABELS } from '../../types/font';
import type { FontPair } from '../../types/font';
import { Trash2, Play } from 'lucide-react';
import { cn } from '../../lib/utils';

interface Props {
  pair: FontPair;
  onApply: () => void;
  onDelete: () => void;
}

export function FavoriteCard({ pair, onApply, onDelete }: Props) {
  const date = new Date(pair.savedAt);
  const dateStr = `${date.getMonth() + 1}/${date.getDate()} ${String(
    date.getHours(),
  ).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;

  return (
    <div className="group rounded-lg border border-zinc-800 bg-zinc-900/50 p-4 transition hover:border-zinc-700 hover:bg-zinc-900">
      <div className="mb-3 flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <div className="truncate text-[13px] font-semibold text-zinc-100">
            {pair.fontA.family}
          </div>
          {pair.fontB && (
            <div className="mt-0.5 flex items-center gap-1 text-[11px] text-zinc-500">
              <span>+</span>
              <span className="truncate">{pair.fontB.family}</span>
            </div>
          )}
        </div>
        <span className="shrink-0 rounded bg-zinc-800 px-1.5 py-0.5 text-[10px] text-zinc-500">
          {dateStr}
        </span>
      </div>

      <div className="space-y-1.5 rounded-md bg-zinc-950/50 p-3">
        <div className="flex items-center gap-2 text-[10px]">
          <span
            className={cn(
              'h-3 w-0.5 rounded-sm',
              'bg-accent',
            )}
          />
          <span className="truncate text-zinc-300" style={{ fontFamily: `'${pair.fontA.family}', ${pair.fontA.category}` }}>
            {pair.fontA.family}
          </span>
          <span className="ml-auto shrink-0 text-zinc-600">
            {CATEGORY_LABELS[pair.fontA.category]}
          </span>
        </div>
        {pair.fontB && (
          <div className="flex items-center gap-2 text-[10px]">
            <span className="h-3 w-0.5 rounded-sm bg-mint" />
            <span className="truncate text-zinc-300" style={{ fontFamily: `'${pair.fontB.family}', ${pair.fontB.category}` }}>
              {pair.fontB.family}
            </span>
            <span className="ml-auto shrink-0 text-zinc-600">
              {CATEGORY_LABELS[pair.fontB.category]}
            </span>
          </div>
        )}
      </div>

      <div className="mt-3 flex gap-2">
        <button
          onClick={onApply}
          className="flex flex-1 items-center justify-center gap-1.5 rounded-md border border-zinc-800 bg-zinc-800/40 py-1.5 text-[11px] text-zinc-300 transition hover:border-accent/50 hover:text-accent"
        >
          <Play className="h-3 w-3" />
          应用
        </button>
        <button
          onClick={onDelete}
          className="flex items-center justify-center rounded-md border border-zinc-800 bg-zinc-800/40 px-2.5 text-[11px] text-zinc-400 transition hover:border-red-500/40 hover:text-red-400"
        >
          <Trash2 className="h-3 w-3" />
        </button>
      </div>
    </div>
  );
}
