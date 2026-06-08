import { Sparkles } from 'lucide-react';
import { usePairingRecommend } from '../../hooks/usePairingRecommend';
import { useFontStore } from '../../store/useFontStore';
import { PairingCard } from './PairingCard';

export function PairingRecommend() {
  const fontA = useFontStore((s) => s.fontA);
  const setFontB = useFontStore((s) => s.setFontB);
  const toggleCompareMode = useFontStore((s) => s.toggleCompareMode);
  const compareMode = useFontStore((s) => s.compareMode);
  const scores = usePairingRecommend(fontA, 8);

  const apply = (family: string) => {
    const target = scores.find((s) => s.font.family === family);
    if (!target) return;
    setFontB(target.font);
    if (!compareMode) toggleCompareMode();
  };

  return (
    <section className="rounded-xl border border-zinc-800/70 bg-zinc-900/30 p-5">
      <header className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-gradient-to-br from-accent/80 to-mint/80 text-white">
            <Sparkles className="h-3.5 w-3.5" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-zinc-100">
              字体配对推荐
            </h3>
            <p className="text-[11px] text-zinc-500">
              {fontA ? `基于「${fontA.family}」推荐互补字体` : '先选择字体获取推荐'}
            </p>
          </div>
        </div>
      </header>

      {scores.length === 0 ? (
        <div className="rounded-md border border-dashed border-zinc-800 py-12 text-center text-xs text-zinc-600">
          请先选择字体 A，然后基于互补分类和视觉层次推荐适合的字体 B
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {scores.map((s, i) => (
            <PairingCard
              key={s.font.family}
              score={s}
              rank={i}
              onClick={() => apply(s.font.family)}
            />
          ))}
        </div>
      )}
    </section>
  );
}
