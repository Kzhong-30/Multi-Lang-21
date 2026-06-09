import { useMemo, useState } from 'react';
import { ChevronDown, ChevronUp, Loader2, PanelLeftClose, PanelLeftOpen, X, Type } from 'lucide-react';
import { useFontStore } from '../../store/useFontStore';
import { FontSearch } from './FontSearch';
import { CategoryFilter } from './CategoryFilter';
import { FontItem } from './FontItem';
import { cn } from '../../lib/utils';

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
  const [collapsed, setCollapsed] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return fonts.filter((f) => {
      const matchCat = category === 'all' || f.category === category;
      const matchQ = q === '' || f.family.toLowerCase().includes(q);
      return matchCat && matchQ;
    });
  }, [fonts, query, category]);

  const visible = filtered.slice(0, visibleCount);

  const listContent = (
    <div className="flex h-full flex-col">
      <div className="border-b border-zinc-800/60 px-4 py-4">
        <div className="mb-3 flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-gradient-to-br from-accent to-amber-500 text-white">
            <span className="text-lg font-bold leading-none">Aa</span>
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-[15px] font-semibold text-zinc-100">
              Typography Lab
            </h1>
            <p className="text-[11px] text-zinc-500">字体预览与配对工具</p>
          </div>
          <button
            onClick={() => setSheetOpen(false)}
            className="md:hidden flex h-8 w-8 items-center justify-center rounded-md text-zinc-400 transition hover:bg-zinc-800/50 hover:text-zinc-100"
          >
            <X className="h-4 w-4" />
          </button>
          <button
            onClick={() => setCollapsed((c) => !c)}
            className="hidden md:flex h-8 w-8 items-center justify-center rounded-md text-zinc-400 transition hover:bg-zinc-800/50 hover:text-zinc-100"
            title={collapsed ? '展开字体列表' : '折叠字体列表'}
          >
            {collapsed ? <PanelLeftOpen className="h-4 w-4" /> : <PanelLeftClose className="h-4 w-4" />}
          </button>
        </div>
        {!collapsed && (
          <>
            <FontSearch />
            <div className="mt-3">
              <CategoryFilter />
            </div>
          </>
        )}
      </div>

      {!collapsed && compareMode && (
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

      {!collapsed && (
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
      )}

      {!collapsed && (
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
      )}

      {!collapsed && filtered.length > visible.length && (
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

      {!collapsed && (
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
      )}

      {collapsed && (
        <div className="flex flex-1 flex-col items-center gap-3 py-4">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-gradient-to-br from-accent to-amber-500 text-white">
            <Type className="h-4 w-4" />
          </div>
          <div className="text-center px-2">
            <div className="text-[10px] font-semibold text-zinc-300">
              {fonts.length}
            </div>
            <div className="text-[9px] text-zinc-500">字体</div>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <>
      <aside
        className={cn(
          'hidden md:flex h-full shrink-0 flex-col border-r border-zinc-800/80 bg-zinc-950/70 backdrop-blur-sm transition-all duration-300',
          collapsed ? 'w-[68px]' : 'w-[280px]',
        )}
      >
        {listContent}
      </aside>

      <button
        onClick={() => setSheetOpen(true)}
        className="md:hidden fixed bottom-5 left-1/2 z-30 -translate-x-1/2 flex items-center gap-2 rounded-full bg-accent px-5 py-3 text-xs font-medium text-white shadow-[0_0_32px_rgba(232,114,58,0.45)] transition hover:bg-amber-500"
      >
        <Type className="h-4 w-4" />
        选择字体
        {fonts.length > 0 && (
          <span className="ml-1 rounded-full bg-white/20 px-2 py-0.5 text-[10px]">
            {fonts.length}
          </span>
        )}
      </button>

      <div
        className={cn(
          'md:hidden fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity',
          sheetOpen ? 'opacity-100' : 'pointer-events-none opacity-0',
        )}
        onClick={() => setSheetOpen(false)}
      />
      <aside
        className={cn(
          'md:hidden fixed inset-x-0 bottom-0 z-50 flex max-h-[85vh] flex-col rounded-t-2xl border-t border-zinc-800 bg-zinc-950 shadow-2xl transition-transform duration-300',
          sheetOpen ? 'translate-y-0' : 'translate-y-full',
        )}
      >
        <div className="flex shrink-0 justify-center pt-2 pb-1">
          <div className="h-1 w-10 rounded-full bg-zinc-700" />
        </div>
        {listContent}
      </aside>
    </>
  );
}
