import { X, Bookmark } from 'lucide-react';
import { useFontStore } from '../../store/useFontStore';
import { FavoriteCard } from './FavoriteCard';
import { cn } from '../../lib/utils';

export function FavoritesDrawer() {
  const open = useFontStore((s) => s.showFavoritesDrawer);
  const setOpen = useFontStore((s) => s.setShowFavoritesDrawer);
  const favorites = useFontStore((s) => s.favorites);
  const deleteFavorite = useFontStore((s) => s.deleteFavorite);
  const applyFavorite = useFontStore((s) => s.applyFavorite);

  return (
    <>
      <div
        className={cn(
          'fixed inset-0 z-40 bg-black/40 backdrop-blur-sm transition-opacity',
          open ? 'opacity-100' : 'pointer-events-none opacity-0',
        )}
        onClick={() => setOpen(false)}
      />
      <aside
        className={cn(
          'fixed right-0 top-0 z-50 flex h-full w-[380px] max-w-full flex-col border-l border-zinc-800 bg-zinc-950 shadow-2xl transition-transform duration-300',
          open ? 'translate-x-0' : 'translate-x-full',
        )}
      >
        <header className="flex items-center justify-between border-b border-zinc-800 px-5 py-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-mint/20 text-mint">
              <Bookmark className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-zinc-100">
                我的收藏夹
              </h2>
              <p className="text-[11px] text-zinc-500">
                已保存 {favorites.length} 个配对方案
              </p>
            </div>
          </div>
          <button
            onClick={() => setOpen(false)}
            className="flex h-8 w-8 items-center justify-center rounded-md text-zinc-400 transition hover:bg-zinc-800/50 hover:text-zinc-100"
          >
            <X className="h-4 w-4" />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto space-y-3 p-4">
          {favorites.length === 0 ? (
            <div className="mt-12 text-center">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-zinc-900 text-zinc-600">
                <Bookmark className="h-5 w-5" />
              </div>
              <p className="text-sm text-zinc-400">暂无收藏的字体配对</p>
              <p className="mt-1 text-[11px] text-zinc-600">
                在预览区点击「保存到收藏夹」按钮
              </p>
            </div>
          ) : (
            favorites.map((p) => (
              <FavoriteCard
                key={p.id}
                pair={p}
                onApply={() => {
                  applyFavorite(p);
                  setOpen(false);
                }}
                onDelete={() => deleteFavorite(p.id)}
              />
            ))
          )}
        </div>
      </aside>
    </>
  );
}
