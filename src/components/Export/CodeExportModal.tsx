import { useState } from 'react';
import { X, Code, Copy, Check, Link2 } from 'lucide-react';
import { useFontStore } from '../../store/useFontStore';
import {
  generateImportCode,
  generateLinkCode,
  weightsFromVariants,
} from '../../utils/cssGenerator';
import { cn } from '../../lib/utils';

type Tab = 'import' | 'link';

export function CodeExportModal() {
  const open = useFontStore((s) => s.showExportModal);
  const setOpen = useFontStore((s) => s.setShowExportModal);
  const fontA = useFontStore((s) => s.fontA);
  const fontB = useFontStore((s) => s.fontB);
  const compareMode = useFontStore((s) => s.compareMode);
  const styleAWeight = useFontStore((s) => s.styleA.fontWeight);
  const styleBWeight = useFontStore((s) => s.styleB.fontWeight);

  const [tab, setTab] = useState<Tab>('import');
  const [copied, setCopied] = useState(false);

  if (!open) return null;

  const fontsForExport = [];
  if (fontA) {
    const allW = weightsFromVariants(fontA.variants);
    const w = Array.from(new Set([styleAWeight, 400, 700, ...allW.slice(0, 4)])).slice(0, 6);
    fontsForExport.push({ family: fontA.family, weights: w });
  }
  if (compareMode && fontB) {
    const allW = weightsFromVariants(fontB.variants);
    const w = Array.from(new Set([styleBWeight, 400, 700, ...allW.slice(0, 4)])).slice(0, 6);
    fontsForExport.push({ family: fontB.family, weights: w });
  }

  const codeImport = fontsForExport.length
    ? generateImportCode(fontsForExport)
    : '请先选择字体';
  const codeLink = fontsForExport.length
    ? generateLinkCode(fontsForExport)
    : '请先选择字体';

  const code = tab === 'import' ? codeImport : codeLink;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      /* ignore */
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={() => setOpen(false)}
      />
      <div className="relative z-10 w-full max-w-2xl overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950 shadow-2xl">
        <header className="flex items-center justify-between border-b border-zinc-800 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent/15 text-accent">
              <Code className="h-4.5 w-4.5" />
            </div>
            <div>
              <h2 className="text-[15px] font-semibold text-zinc-100">
                导出集成代码
              </h2>
              <p className="text-[11px] text-zinc-500">
                {fontsForExport.length === 0
                  ? '请先选择字体'
                  : fontsForExport.length === 1
                    ? `导出字体：${fontsForExport[0].family}`
                    : `导出字体：${fontsForExport.map((f) => f.family).join(' + ')}`}
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

        <div className="flex gap-1 border-b border-zinc-800 bg-zinc-900/40 px-4 pt-2">
          <button
            onClick={() => setTab('import')}
            className={cn(
              'flex items-center gap-1.5 rounded-t-md px-3.5 py-2 text-xs transition',
              tab === 'import'
                ? 'bg-zinc-950 text-zinc-100 shadow-[0_-1px_0_0_rgba(232,114,58,0.4)_inset]'
                : 'text-zinc-500 hover:text-zinc-300',
            )}
          >
            <Code className="h-3.5 w-3.5" />
            CSS @import
          </button>
          <button
            onClick={() => setTab('link')}
            className={cn(
              'flex items-center gap-1.5 rounded-t-md px-3.5 py-2 text-xs transition',
              tab === 'link'
                ? 'bg-zinc-950 text-zinc-100 shadow-[0_-1px_0_0_rgba(74,158,125,0.4)_inset]'
                : 'text-zinc-500 hover:text-zinc-300',
            )}
          >
            <Link2 className="h-3.5 w-3.5" />
            HTML link
          </button>
        </div>

        <div className="relative">
          <pre className="max-h-[55vh] overflow-auto bg-[#0b0c0f] p-5 text-[12px] leading-relaxed text-zinc-200">
            <code>{code}</code>
          </pre>
          <button
            onClick={handleCopy}
            className={cn(
              'absolute right-4 top-4 flex items-center gap-1.5 rounded-md border px-2.5 py-1.5 text-[11px] transition',
              copied
                ? 'border-mint/50 bg-mint/15 text-mint'
                : 'border-zinc-700 bg-zinc-900 text-zinc-300 hover:border-zinc-600 hover:text-zinc-100',
            )}
          >
            {copied ? (
              <>
                <Check className="h-3 w-3" />
                已复制
              </>
            ) : (
              <>
                <Copy className="h-3 w-3" />
                复制代码
              </>
            )}
          </button>
        </div>

        <footer className="border-t border-zinc-800 bg-zinc-900/30 px-6 py-3 text-[11px] text-zinc-500">
          <p>
            💡 提示：将代码粘贴到项目 CSS 文件（@import）或 HTML 头部（link），
            即可在你的项目中使用所选字体。
          </p>
        </footer>
      </div>
    </div>
  );
}
