import { CATEGORY_LABELS } from '../../types/font';
import type { FontItem, StyleParams } from '../../types/font';
import { useFontLoader } from '../../hooks/useFontLoader';
import { Loader2 } from 'lucide-react';

interface Props {
  label: string;
  font: FontItem | null;
  style: StyleParams;
  accent: 'accent' | 'mint';
}

export function PreviewCanvas({ label, font, style, accent }: Props) {
  const { loading } = useFontLoader(font, [style.fontWeight]);

  const accentClasses =
    accent === 'accent'
      ? 'border-accent/30 from-accent/10'
      : 'border-mint/30 from-mint/10';
  const accentText = accent === 'accent' ? 'text-accent' : 'text-mint';
  const accentBar =
    accent === 'accent' ? 'bg-accent' : 'bg-mint';

  return (
    <div
      className={`relative flex flex-col overflow-hidden rounded-xl border border-zinc-200 bg-[#f8f5f0] shadow-[0_1px_0_rgba(15,17,21,0.04),0_20px_40px_-24px_rgba(15,17,21,0.35)]`}
    >
      <div
        className={`flex items-center justify-between border-b border-zinc-200/80 bg-gradient-to-r ${accentClasses} to-transparent px-5 py-3`}
      >
        <div className="flex items-center gap-2">
          <span className={`h-4 w-0.5 rounded-sm ${accentBar}`} />
          <span className={`text-[11px] font-semibold uppercase tracking-wider ${accentText}`}>
            {label}
          </span>
          <span className="text-[11px] text-zinc-500">·</span>
          <span className="text-[11px] font-medium text-zinc-700">
            {font?.family ?? '未选择字体'}
          </span>
          {font && (
            <>
              <span className="text-[11px] text-zinc-400">·</span>
              <span className="text-[10px] text-zinc-500">
                {CATEGORY_LABELS[font.category]}
              </span>
            </>
          )}
        </div>
        <div className="flex items-center gap-3 text-[10px] text-zinc-500">
          <span className="tabular-nums">
            {style.fontSize}px
          </span>
          <span className="tabular-nums">w{style.fontWeight}</span>
          <span className="tabular-nums">lh{style.lineHeight}</span>
          {loading && (
            <Loader2 className="h-3 w-3 animate-spin text-zinc-400" />
          )}
        </div>
      </div>

      <div className="flex-1 p-10 md:p-12">
        {!font ? (
          <div className="flex h-full min-h-[180px] items-center justify-center text-sm text-zinc-400">
            从左侧选择字体开始预览
          </div>
        ) : (
          <div
            className="whitespace-pre-wrap break-words text-zinc-900 transition-all duration-300"
            style={{
              fontFamily: `'${font.family}', ${font.category}`,
              fontSize: `${style.fontSize}px`,
              fontWeight: style.fontWeight,
              lineHeight: style.lineHeight,
              letterSpacing: `${style.letterSpacing}em`,
              opacity: loading ? 0.6 : 1,
            }}
          >
            {style.previewText}
          </div>
        )}
      </div>
    </div>
  );
}
