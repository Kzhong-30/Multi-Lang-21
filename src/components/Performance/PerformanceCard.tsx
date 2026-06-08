import { Gauge, Clock, HardDrive, Layers } from 'lucide-react';
import { useFontStore } from '../../store/useFontStore';
import type { FontPerformance } from '../../types/font';

interface Props {
  family: string | undefined;
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
    <div className="flex items-start gap-2">
      <Icon className={`mt-0.5 h-3 w-3 ${color}`} strokeWidth={2} />
      <div>
        <div className="text-[9px] uppercase tracking-wider text-zinc-500">
          {label}
        </div>
        <div className={`text-[12px] font-semibold tabular-nums ${color}`}>
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

export function PerformanceCard({ family }: Props) {
  const map = useFontStore((s) => s.performanceMap);
  const fonts = useFontStore((s) => s.fonts);

  const perf = family ? map[family] ?? emptyPerf(family) : null;
  const font = fonts.find((f) => f.family === family);

  if (!perf || !font) return null;

  const variantCount = perf.variantCount || font.variants.length;
  const loadMs = perf.loadTimeMs > 0 ? perf.loadTimeMs : '—';
  const sizeKb = perf.fileSizeKb > 0 ? perf.fileSizeKb : '—';

  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-4 backdrop-blur-sm">
      <div className="mb-3 flex items-center gap-2">
        <div className="flex h-6 w-6 items-center justify-center rounded-md bg-zinc-800 text-zinc-300">
          <Gauge className="h-3.5 w-3.5" />
        </div>
        <div>
          <h4 className="text-[11px] font-semibold text-zinc-200">
            字体性能报告
          </h4>
          <p className="truncate text-[10px] text-zinc-500">{family}</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <Metric
          icon={Clock}
          label="加载时长"
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
          label="文件大小"
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
          label="变体数"
          value={variantCount}
          tone="mint"
        />
      </div>

      {typeof loadMs === 'number' && loadMs > 0 && (
        <div className="mt-3 border-t border-zinc-800/60 pt-2 text-[10px] text-zinc-500">
          {loadMs < 300
            ? '⚡ 加载快速，性能优秀'
            : loadMs < 800
              ? '✓ 加载正常，可接受'
              : '⚠ 加载较慢，考虑子集化或 CDN'}
        </div>
      )}
    </div>
  );
}
