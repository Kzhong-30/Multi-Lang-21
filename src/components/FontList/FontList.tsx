import { useMemo, useState } from 'react';
import { ChevronDown, ChevronUp, Loader2 } from 'lucide-react';
import { useFontStore } from '../../store/useFontStore';
import { FontSearch } from './FontSearch';
import { CategoryFilter } from './CategoryFilter';
import { FontItem } from './FontItem';

interface Props {
  loading: boolean;
}

export function FontList({ loading }: Props) {
  const fonts = useFontStore((s) => s.fonts);
  const query = useFontStore((s) => s.searchQuery);
  const category = useFontStore((s) => s.activeCategory);
  const compareMode = useFontStore((s) => s.compareMode);
  const [visibleCount, setVisibleCount] = useState(60);
  const [target, setTarget] = useState<'A' | 'B'>('A');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return fonts.filter((f) => {
      const matchCat = category === 'all' || f.category === category;
      const matchQ = q === '' || f.family.toLowerCase().includes(q);
      return matchCat && matchQ;
    });
  }, [fonts, query, category]);

  const visible = filtered.slice(0, visibleCount);

  return (
    <aside className="flex h-full w-[300px] shrink-0 flex-col border-r border-zinc-800/80 bg-zinc-950/70 backdrop-blur-sm">
      <div className="border-b border-zinc-800/60 px-4 py-4">
        <div className="mb-3 flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-gradient-to-br from-accent to-amber-500 text-white">
            <span className="text-lg font-bold leading-none">Aa</span>
          </div>
          <div>
            <h1 className="text-[15px] font-semibold text-zinc-100">
              Typography Lab
            </h1>
            <p className="text-[11px] text-zinc-500">字体预览与配对工具</p>
          </div>
        </div>
        <FontSearch />
        <div className="mt-3">
          <CategoryFilter />
        </div>
      </div>

      {compareMode && (
        <div className="border-b border-zinc-800/60 px-4 py-2.5">
          <p className="mb-2 text-[11px] uppercase tracking-wider text-zinc-500">
            选择字体应用到
          </p>
          <div className="flex rounded-md border border-zinc-800 bg-zinc-900/40 p-0.5 text-xs">
            <button
              onClick={() => setTarget('A')}
              className={`flex-1 rounded px-2 py-1.5 transition ${
                target === 'A'
                  ? 'bg-accent text-white shadow'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              字体 A（标题）
            </button>
            <button
              onClick={() => setTarget('B')}
              className={`flex-1 rounded px-2 py-1.5 transition ${
                target === 'B'
                  ? 'bg-mint text-zinc-950 shadow'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              字体 B（正文）
            </button>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between border-b border-zinc-800/60 px-4 py-2">
        <span className="text-[11px] text-zinc-500">
          {loading
            ? '加载字体列表...'
            : `共 ${filtered.length} 款字体${
                filtered.length > visible.length ? `（显示 ${visible.length}）` : ''
              }`}
        </span>
        {loading && <Loader2 className="h-3 w-3 animate-spin text-accent" />}
      </div>

      <div className="flex-1 space-y-1 overflow-y-auto px-3 py-3">
        {visible.map((f) => (
          <FontItem key={f.family} font={f} target={target} />
        ))}
        {!loading && filtered.length === 0 && (
          <div className="px-3 py-10 text-center text-xs text-zinc-600">
            没有匹配的字体
          </div>
        )}
      </div>

      {filtered.length > visible.length && (
        <div className="border-t border-zinc-800/60 p-3">
          <button
            onClick={() =>
              setVisibleCount((c) =>
                Math.min(c + 60, filtered.length),
              )
            }
            className="flex w-full items-center justify-center gap-1.5 rounded-md border border-zinc-800 bg-zinc-900/50 py-2 text-xs text-zinc-300 transition hover:border-zinc-700 hover:bg-zinc-900 hover:text-zinc-100"
          >
            <ChevronDown className="h-3.5 w-3.5" />
            加载更多字体
            <ChevronDown className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      <div className="border-t border-zinc-800/60 p-3">
        <button
          onClick={() => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            setVisibleCount(60);
          }}
          className="flex w-full items-center justify-center gap-1.5 rounded-md bg-zinc-800/40 py-2 text-[11px] text-zinc-500 transition hover:text-zinc-300"
        >
          <ChevronUp className="h-3 w-3" />
          回到顶部
        </button>
      </div>
    </aside>
  );
}
