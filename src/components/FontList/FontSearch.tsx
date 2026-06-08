import { Search } from 'lucide-react';
import { useFontStore } from '../../store/useFontStore';

export function FontSearch() {
  const query = useFontStore((s) => s.searchQuery);
  const setQuery = useFontStore((s) => s.setSearchQuery);

  return (
    <div className="relative">
      <Search
        className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500"
        strokeWidth={2}
      />
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="搜索字体名称..."
        className="w-full rounded-md border border-zinc-800 bg-zinc-900/60 py-2 pl-9 pr-3 text-sm text-zinc-100 placeholder:text-zinc-600 outline-none transition focus:border-accent focus:bg-zinc-900"
      />
    </div>
  );
}
