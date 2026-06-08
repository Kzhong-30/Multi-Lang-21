import {
  BookmarkPlus,
  Bookmark,
  Code2,
  Save,
  RotateCcw,
  Heart,
} from 'lucide-react';
import { useFontStore } from '../store/useFontStore';
import { FontList } from '../components/FontList/FontList';
import { ComparePreview } from '../components/Preview/ComparePreview';
import { StyleControls } from '../components/Controls/StyleControls';
import { TextInput } from '../components/Controls/TextInput';
import { ModeToggle } from '../components/Controls/ModeToggle';
import { PairingRecommend } from '../components/Pairing/PairingRecommend';
import { FavoritesDrawer } from '../components/Favorites/FavoritesDrawer';
import { CodeExportModal } from '../components/Export/CodeExportModal';
import { PerformanceCard } from '../components/Performance/PerformanceCard';
import { DEFAULT_STYLE_A, DEFAULT_STYLE_B } from '../types/font';
import { hasFavorite } from '../utils/storage';
import { useMemo, useState } from 'react';
import { cn } from '../lib/utils';

export default function Home() {
  const fontA = useFontStore((s) => s.fontA);
  const fontB = useFontStore((s) => s.fontB);
  const compareMode = useFontStore((s) => s.compareMode);
  const styleA = useFontStore((s) => s.styleA);
  const styleB = useFontStore((s) => s.styleB);
  const setStyleA = useFontStore((s) => s.setStyleA);
  const setStyleB = useFontStore((s) => s.setStyleB);
  const saveCurrentPair = useFontStore((s) => s.saveCurrentPair);
  const favorites = useFontStore((s) => s.favorites);
  const setShowExportModal = useFontStore((s) => s.setShowExportModal);
  const setShowFavoritesDrawer = useFontStore(
    (s) => s.setShowFavoritesDrawer,
  );

  const [toast, setToast] = useState<string | null>(null);
  const [, forceTick] = useState(0);

  const isFavorited = useMemo(
    () =>
      hasFavorite(
        fontA?.family ?? '',
        compareMode ? fontB?.family ?? null : null,
      ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [fontA?.family, fontB?.family, compareMode, favorites.length, toast],
  );

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 1800);
  };

  const handleSave = () => {
    const p = saveCurrentPair();
    if (p) {
      showToast('✓ 已保存到收藏夹');
      forceTick((t) => t + 1);
    }
  };

  const handleReset = () => {
    setStyleA({ ...DEFAULT_STYLE_A });
    setStyleB({ ...DEFAULT_STYLE_B });
    showToast('样式已重置');
  };

  return (
    <div className="flex h-full w-full overflow-hidden">
      <FontList loading={false} />

      <main className="flex min-w-0 flex-1 flex-col overflow-hidden">
        {/* Top toolbar */}
        <header className="flex shrink-0 flex-wrap items-center justify-between gap-3 border-b border-zinc-800/80 bg-zinc-950/60 px-5 py-3 backdrop-blur">
          <div className="flex flex-wrap items-center gap-2">
            <ModeToggle />
            <button
              onClick={handleReset}
              className="flex items-center gap-1.5 rounded-md border border-zinc-800 bg-zinc-900/60 px-3 py-2 text-xs text-zinc-300 transition hover:border-zinc-700 hover:text-zinc-100"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              重置样式
            </button>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleSave}
              className={cn(
                'flex items-center gap-1.5 rounded-md border px-3 py-2 text-xs transition',
                isFavorited
                  ? 'border-mint/50 bg-mint/10 text-mint'
                  : 'border-zinc-800 bg-zinc-900/60 text-zinc-300 hover:border-mint/40 hover:text-mint',
              )}
            >
              {isFavorited ? (
                <Heart className="h-3.5 w-3.5 fill-current" />
              ) : (
                <BookmarkPlus className="h-3.5 w-3.5" />
              )}
              {isFavorited ? '已收藏' : '保存配对'}
            </button>
            <button
              onClick={() => setShowFavoritesDrawer(true)}
              className="flex items-center gap-1.5 rounded-md border border-zinc-800 bg-zinc-900/60 px-3 py-2 text-xs text-zinc-300 transition hover:border-zinc-700 hover:text-zinc-100"
            >
              <Bookmark className="h-3.5 w-3.5" />
              收藏夹
              <span className="ml-1 rounded bg-zinc-800 px-1.5 py-0.5 text-[10px] text-zinc-400">
                {favorites.length}
              </span>
            </button>
            <button
              onClick={() => setShowExportModal(true)}
              className="flex items-center gap-1.5 rounded-md bg-accent px-3 py-2 text-xs font-medium text-white shadow-[0_0_24px_rgba(232,114,58,0.3)] transition hover:bg-amber-500"
            >
              <Code2 className="h-3.5 w-3.5" />
              导出代码
            </button>
          </div>
        </header>

        {/* Scrollable content */}
        <div className="min-h-0 flex-1 overflow-y-auto">
          <div className="mx-auto w-full max-w-[1400px] space-y-6 p-6">
            {/* Top grid: preview + performance */}
            <div className="grid grid-cols-1 gap-5 xl:grid-cols-[1fr_280px]">
              <ComparePreview />
              <div className="space-y-4">
                <PerformanceCard family={fontA?.family} />
                {compareMode && fontB && (
                  <PerformanceCard family={fontB.family} />
                )}

                {/* Quick stats */}
                <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-4">
                  <div className="mb-2 flex items-center gap-2">
                    <Save className="h-3.5 w-3.5 text-zinc-400" />
                    <h4 className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
                      当前配置
                    </h4>
                  </div>
                  <div className="space-y-2 text-[11px] text-zinc-400">
                    <div className="flex items-center justify-between rounded bg-zinc-950/50 px-2.5 py-1.5">
                      <span className="text-zinc-500">字体 A</span>
                      <span className="truncate font-medium text-zinc-200">
                        {fontA?.family ?? '—'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between rounded bg-zinc-950/50 px-2.5 py-1.5">
                      <span className="text-zinc-500">字体 B</span>
                      <span className="truncate font-medium text-zinc-200">
                        {compareMode ? fontB?.family ?? '—' : '（未启用）'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between rounded bg-zinc-950/50 px-2.5 py-1.5">
                      <span className="text-zinc-500">字号比</span>
                      <span className="tabular-nums font-medium text-zinc-200">
                        {styleA.fontSize}
                        <span className="text-zinc-500">:</span>
                        {compareMode ? styleB.fontSize : styleA.fontSize}px
                      </span>
                    </div>
                    <div className="flex items-center justify-between rounded bg-zinc-950/50 px-2.5 py-1.5">
                      <span className="text-zinc-500">字重比</span>
                      <span className="tabular-nums font-medium text-zinc-200">
                        w{styleA.fontWeight}
                        <span className="text-zinc-500">:</span>
                        w{compareMode ? styleB.fontWeight : styleA.fontWeight}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Style controls */}
            <section className="grid grid-cols-1 gap-5 lg:grid-cols-2">
              <StyleControls which="A" font={fontA} />
              {compareMode ? (
                <StyleControls which="B" font={fontB} />
              ) : (
                <div className="grid grid-cols-1 gap-3">
                  <TextInput which="A" />
                </div>
              )}
              {compareMode && (
                <div className="col-span-1 grid grid-cols-1 gap-3 lg:col-span-2">
                  <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                    <TextInput which="A" />
                    <TextInput which="B" />
                  </div>
                </div>
              )}
            </section>

            {/* Pairing recommendations */}
            <PairingRecommend />
          </div>
        </div>
      </main>

      <FavoritesDrawer />
      <CodeExportModal />

      {/* Toast */}
      <div
        className={cn(
          'fixed bottom-6 left-1/2 z-[60] -translate-x-1/2 transform rounded-full border border-zinc-800 bg-zinc-900/95 px-4 py-2 text-xs text-zinc-100 shadow-xl backdrop-blur transition-all duration-300',
          toast ? 'translate-y-0 opacity-100' : 'translate-y-3 opacity-0 pointer-events-none',
        )}
      >
        {toast}
      </div>
    </div>
  );
}
