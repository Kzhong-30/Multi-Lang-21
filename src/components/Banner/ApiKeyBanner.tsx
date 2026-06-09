import { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, Key, Lock, Unlock, X, Check } from 'lucide-react';
import { FONT_DATASET_COUNT } from '../../data/fonts';

const STORAGE_KEY = 'google-fonts-api-key';

function loadKey(): string {
  try {
    return localStorage.getItem(STORAGE_KEY) ?? '';
  } catch {
    return '';
  }
}

function saveKey(key: string): void {
  try {
    if (key) localStorage.setItem(STORAGE_KEY, key);
    else localStorage.removeItem(STORAGE_KEY);
  } catch { /* empty */ }
}

interface Props {
  apiKey: string;
  onKeyChange: (key: string) => void;
}

export function ApiKeyBanner({ apiKey, onKeyChange }: Props) {
  const [expanded, setExpanded] = useState(!apiKey);
  const [draft, setDraft] = useState(apiKey);
  const [saved, setSaved] = useState(!!apiKey);

  useEffect(() => {
    setDraft(apiKey);
    setSaved(!!apiKey);
  }, [apiKey]);

  const handleSave = () => {
    const trimmed = draft.trim();
    saveKey(trimmed);
    onKeyChange(trimmed);
    setSaved(!!trimmed);
    if (trimmed) setExpanded(false);
  };

  const handleClear = () => {
    setDraft('');
    saveKey('');
    onKeyChange('');
    setSaved(false);
  };

  return (
    <div className="border-b border-amber-500/20 bg-gradient-to-r from-amber-950/40 via-zinc-950/60 to-amber-950/40 backdrop-blur-sm">
      <div className="mx-auto flex w-full max-w-[1600px] items-center gap-3 px-5 py-2.5">
        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-amber-500/15 text-amber-400">
          {saved ? <Unlock className="h-3.5 w-3.5" /> : <Lock className="h-3.5 w-3.5" />}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 text-[12px]">
            <span className="font-semibold text-amber-300">
              {saved ? '✓ 已解锁 Google Fonts 全量字体' : '输入 Google Fonts API Key'}
            </span>
            {saved ? (
              <span className="rounded bg-mint/15 px-1.5 py-0.5 text-[10px] font-medium text-mint">
                1500+ 字体
              </span>
            ) : (
              <span className="rounded bg-zinc-800/80 px-1.5 py-0.5 text-[10px] font-medium text-zinc-400">
                默认 {FONT_DATASET_COUNT} 款
              </span>
            )}
          </div>
          {!expanded && !saved && (
            <p className="truncate text-[10px] text-zinc-500">
              免费申请：console.cloud.google.com → APIs &amp; Services → Credentials
            </p>
          )}
        </div>
        <button
          onClick={() => setExpanded((v) => !v)}
          className="flex shrink-0 items-center gap-1 rounded-md border border-zinc-800/80 bg-zinc-900/60 px-2.5 py-1.5 text-[10px] text-zinc-400 transition hover:border-zinc-700 hover:text-zinc-200"
        >
          {expanded ? '收起' : '展开'}
          {expanded ? (
            <ChevronUp className="h-3 w-3" />
          ) : (
            <ChevronDown className="h-3 w-3" />
          )}
        </button>
      </div>

      {expanded && (
        <div className="mx-auto w-full max-w-[1600px] border-t border-amber-500/10 px-5 pb-3 pt-2">
          <div className="flex flex-col gap-2 md:flex-row md:items-center">
            <div className="relative flex-1">
              <Key className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-zinc-500" />
              <input
                type="text"
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                placeholder="粘贴你的 Google Fonts API Key，例如 AIzaSy..."
                className="w-full rounded-md border border-zinc-800 bg-zinc-950/60 py-2 pl-8 pr-8 text-[12px] text-zinc-100 placeholder:text-zinc-600 outline-none transition focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/30"
                spellCheck={false}
                autoComplete="off"
              />
              {draft && (
                <button
                  onClick={() => setDraft('')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-zinc-500 transition hover:bg-zinc-800 hover:text-zinc-200"
                  title="清空"
                >
                  <X className="h-3 w-3" />
                </button>
              )}
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleSave}
                className="flex items-center gap-1.5 rounded-md bg-amber-500 px-3 py-2 text-[11px] font-semibold text-zinc-950 shadow-[0_0_18px_rgba(245,158,11,0.25)] transition hover:bg-amber-400"
              >
                <Check className="h-3.5 w-3.5" />
                {saved ? '更新 Key' : '保存并应用'}
              </button>
              {saved && (
                <button
                  onClick={handleClear}
                  className="rounded-md border border-zinc-800 bg-zinc-900/60 px-3 py-2 text-[11px] text-zinc-400 transition hover:border-red-500/30 hover:text-red-400"
                >
                  移除
                </button>
              )}
            </div>
          </div>
          <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-[10px] text-zinc-500">
            <span>🔒 Key 仅保存在你的浏览器 localStorage，不会上传</span>
            <span>📚 无 Key：内置 {FONT_DATASET_COUNT} 款 | 有 Key：Google Fonts 1500+ 全量</span>
            <span>⏱ 数据缓存 24 小时，更新 Key 后自动刷新</span>
          </div>
        </div>
      )}
    </div>
  );
}

export { loadKey as loadApiKey, saveKey as saveApiKey };
