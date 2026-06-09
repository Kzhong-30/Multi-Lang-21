import { ArrowRight } from 'lucide-react';
import type { PairingScore } from '../../utils/pairingAlgorithm';
import { CATEGORY_LABELS } from '../../types/font';
import { useFontLoader } from '../../hooks/useFontLoader';

interface Props {
  score: PairingScore;
  rank: number;
  onClick: () => void;
  compact?: boolean;
}

export function PairingCard({ score, rank, onClick, compact }: Props) {
  useFontLoader(score.font, [400, 700]);

  const rating =
    score.score >= 0.85 ? '极佳' : score.score >= 0.7 ? '良好' : '搭配';
  const ratingColor =
    score.score >= 0.85
      ? 'bg-mint/15 text-mint'
      : score.score >= 0.7
        ? 'bg-accent/15 text-accent'
        : 'bg-zinc-800 text-zinc-400';

  if (compact) {
    return (
      <button
        onClick={onClick}
        className="group flex w-full items-center gap-3 rounded-lg border border-zinc-800 bg-zinc-900/60 p-2.5 text-left transition-all duration-200 hover:border-zinc-700 hover:bg-zinc-900"
      >
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-zinc-800/70">
          <span
            className="text-[13px] leading-none text-zinc-300"
            style={{ fontFamily: `'${score.font.family}', ${score.font.category}` }}
          >
            Aa
          </span>
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <span className="truncate text-[12px] font-medium text-zinc-100">
              {score.font.family}
            </span>
            <span className={`shrink-0 rounded px-1.5 py-0.5 text-[9px] ${ratingColor}`}>
              {Math.round(score.score * 100)}
            </span>
          </div>
          <div className="mt-0.5 flex items-center justify-between">
            <span className="text-[10px] text-zinc-500">
              #{rank + 1} · {CATEGORY_LABELS[score.font.category]}
            </span>
            <ArrowRight className="h-3 w-3 text-zinc-600 transition group-hover:text-accent" />
          </div>
        </div>
      </button>
    );
  }

  return (
    <button
      onClick={onClick}
      className="group relative flex flex-col overflow-hidden rounded-lg border border-zinc-800 bg-zinc-900/60 p-4 text-left transition-all duration-200 hover:-translate-y-0.5 hover:border-zinc-700 hover:bg-zinc-900 hover:shadow-[0_12px_28px_-16px_rgba(232,114,58,0.35)]"
    >
      <div className="mb-2 flex items-center justify-between">
        <span className="text-[10px] text-zinc-600">#{rank + 1}</span>
        <span className={`rounded px-1.5 py-0.5 text-[10px] ${ratingColor}`}>
          {rating} · {Math.round(score.score * 100)}分
        </span>
      </div>
      <div className="mb-1 flex items-center justify-between gap-2">
        <span className="truncate text-[13px] font-medium text-zinc-100">
          {score.font.family}
        </span>
        <span className="shrink-0 rounded bg-zinc-800 px-1.5 py-0.5 text-[10px] text-zinc-400">
          {CATEGORY_LABELS[score.font.category]}
        </span>
      </div>
      <div
        className="mb-3 truncate text-[16px] leading-tight text-zinc-300"
        style={{ fontFamily: `'${score.font.family}', ${score.font.category}` }}
      >
        Typography speaks
      </div>
      {score.reasons.length > 0 && (
        <div className="flex flex-wrap gap-1 border-t border-zinc-800/60 pt-2">
          {score.reasons.slice(0, 2).map((r) => (
            <span
              key={r}
              className="rounded bg-zinc-800/60 px-1.5 py-0.5 text-[10px] text-zinc-400"
            >
              {r}
            </span>
          ))}
        </div>
      )}
      <div className="mt-3 flex items-center justify-center gap-1 border-t border-zinc-800/60 pt-2 text-[11px] text-zinc-500 transition group-hover:text-accent">
        应用为 B 字体
        <ArrowRight className="h-3 w-3" />
      </div>
    </button>
  );
}
