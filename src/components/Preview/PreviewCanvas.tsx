import { CATEGORY_LABELS } from '../../types/font';
import type { FontItem, StyleParams } from '../../types/font';
import { useFontLoader } from '../../hooks/useFontLoader';
import { Loader2, Gauge, Clock, HardDrive, Layers } from 'lucide-react';
import { useFontStore } from '../../store/useFontStore';
import type { FontPerformance } from '../../types/font';

interface Props {
  label: string;
  font: FontItem | null;
  style: StyleParams;
  accent: 'accent' | 'mint';
}

function Metric({
  icon: Icon,
  label,
  value,
  unit,
  tone,
}: {
  icon: typeof Clock;
  label: string;
  value: number | string;
  unit?: string;
  tone: 'accent' | 'mint' | 'amber';
}) {
  const color =
    tone === 'accent'
      ? 'text-accent'
      : tone === 'mint'
        ? 'text-mint'
        : 'text-amber-400';
  return (
    <div className="flex items-start gap-1.5">
      <Icon className={`mt-0.5 h-2.5 w-2.5 ${color}`} strokeWidth={2} />
      <div>
        <div className="text-[8px] uppercase tracking-wider text-zinc-500">
          {label}
        </div>
        <div className={`text-[10px] font-semibold tabular-nums ${color}`}>
          {value}
          {unit && <span className="ml-0.5 font-normal opacity-70">{unit}</span>}
        </div>
      </div>
    </div>
  );
}

function emptyPerf(family: string): FontPerformance {
  return {
    family,
    loadTimeMs: 0,
    fileSizeKb: 0,
    variantCount: 0,
    loadedAt: 0,
  };
}

function FloatingPerformanceCard({ family }: { family: string | undefined }) {
  const map = useFontStore((s) => s.performanceMap);
  const fonts = useFontStore((s) => s.fonts);

  const perf = family ? map[family] ?? emptyPerf(family) : null;
  const font = fonts.find((f) => f.family === family);

  if (!perf || !font) return null;

  const variantCount = perf.variantCount || font.variants.length;
  const loadMs = perf.loadTimeMs > 0 ? perf.loadTimeMs : '—';
  const sizeKb = perf.fileSizeKb > 0 ? perf.fileSizeKb : '—';
  const hasData = typeof loadMs === 'number' || typeof sizeKb === 'number';

  if (!hasData) return null;

  return (
    <div className="absolute right-3 top-3 z-10 rounded-lg border border-zinc-200/80 bg-white/95 px-3 py-2 shadow-lg backdrop-blur-sm">
      <div className="mb-1.5 flex items-center gap-1.5">
        <Gauge className="h-3 w-3 text-zinc-500" />
        <span className="text-[9px] font-semibold uppercase tracking-wider text-zinc-500">
          性能
        </span>
      </div>
      <div className="flex gap-3">
        <Metric
          icon={Clock}
          label="加载"
          value={loadMs}
          unit={typeof loadMs === 'number' ? 'ms' : undefined}
          tone={
            typeof loadMs === 'number'
              ? loadMs < 300
                ? 'mint'
                : loadMs < 800
                  ? 'accent'
                  : 'amber'
              : 'accent'
          }
        />
        <Metric
          icon={HardDrive}
          label="大小"
          value={sizeKb}
          unit={typeof sizeKb === 'number' ? 'KB' : undefined}
          tone={
            typeof sizeKb === 'number'
              ? sizeKb < 30
                ? 'mint'
                : sizeKb < 80
                  ? 'accent'
                  : 'amber'
              : 'accent'
          }
        />
        <Metric
          icon={Layers}
          label="变体"
          value={variantCount}
          tone="mint"
        />
      </div>
    </div>
  );
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
      <FloatingPerformanceCard family={font?.family} />

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
