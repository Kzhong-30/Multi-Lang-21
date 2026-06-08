import { weightsFromVariants } from '../../utils/cssGenerator';
import { useFontStore } from '../../store/useFontStore';
import type { FontItem } from '../../types/font';
import { cn } from '../../lib/utils';

interface SliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  unit?: string;
  onChange: (v: number) => void;
  accent?: 'accent' | 'mint';
}

function Slider({
  label,
  value,
  min,
  max,
  step,
  unit = '',
  onChange,
  accent = 'accent',
}: SliderProps) {
  const pct = ((value - min) / (max - min)) * 100;
  const track =
    accent === 'accent'
      ? 'accent'
      : 'mint';

  return (
    <div>
      <div className="mb-1 flex items-center justify-between">
        <span className="text-[11px] uppercase tracking-wider text-zinc-500">
          {label}
        </span>
        <span
          className={cn(
            'rounded px-1.5 py-0.5 text-[11px] font-medium tabular-nums',
            accent === 'accent'
              ? 'bg-accent/15 text-accent'
              : 'bg-mint/15 text-mint',
          )}
        >
          {step < 1 ? value.toFixed(2) : value}
          {unit}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="range-slider h-1.5 w-full appearance-none rounded-full bg-zinc-800 outline-none"
        style={{
          background: `linear-gradient(to right, var(--${track}) 0%, var(--${track}) ${pct}%, rgb(39 39 42 / 1) ${pct}%, rgb(39 39 42 / 1) 100%)`,
        }}
      />
    </div>
  );
}

interface Props {
  which: 'A' | 'B';
  font: FontItem | null;
}

export function StyleControls({ which, font }: Props) {
  const styleA = useFontStore((s) => s.styleA);
  const styleB = useFontStore((s) => s.styleB);
  const setStyleA = useFontStore((s) => s.setStyleA);
  const setStyleB = useFontStore((s) => s.setStyleB);

  const style = which === 'A' ? styleA : styleB;
  const setter = which === 'A' ? setStyleA : setStyleB;
  const accent: 'accent' | 'mint' = which === 'A' ? 'accent' : 'mint';
  const availableWeights = font ? weightsFromVariants(font.variants) : [400];

  return (
    <div
      className={cn(
        'space-y-3 rounded-lg border p-3.5',
        which === 'A'
          ? 'border-accent/20 bg-gradient-to-br from-accent/[0.04] to-transparent'
          : 'border-mint/20 bg-gradient-to-br from-mint/[0.04] to-transparent',
      )}
    >
      <div className="mb-2 flex items-center justify-between">
        <span
          className={cn(
            'text-[11px] font-semibold uppercase tracking-wider',
            which === 'A' ? 'text-accent' : 'text-mint',
          )}
        >
          字体 {which} 样式
        </span>
        <span className="truncate text-[11px] text-zinc-500">
          {font?.family ?? '未选择'}
        </span>
      </div>

      <Slider
        label="字号"
        value={style.fontSize}
        min={12}
        max={120}
        step={1}
        unit="px"
        onChange={(v) => setter({ fontSize: Math.round(v) })}
        accent={accent}
      />

      <div>
        <div className="mb-1 flex items-center justify-between">
          <span className="text-[11px] uppercase tracking-wider text-zinc-500">
            字重
          </span>
          <span
            className={cn(
              'rounded px-1.5 py-0.5 text-[11px] font-medium tabular-nums',
              accent === 'accent'
                ? 'bg-accent/15 text-accent'
                : 'bg-mint/15 text-mint',
            )}
          >
            {style.fontWeight}
          </span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {availableWeights.map((w) => (
            <button
              key={w}
              onClick={() => setter({ fontWeight: w })}
              className={cn(
                'rounded border px-2 py-0.5 text-[11px] tabular-nums transition',
                style.fontWeight === w
                  ? accent === 'accent'
                    ? 'border-accent bg-accent text-white'
                    : 'border-mint bg-mint text-zinc-950'
                  : 'border-zinc-800 bg-zinc-900/50 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200',
              )}
            >
              {w}
            </button>
          ))}
        </div>
      </div>

      <Slider
        label="行高"
        value={style.lineHeight}
        min={1}
        max={3}
        step={0.05}
        onChange={(v) => setter({ lineHeight: Number(v.toFixed(2)) })}
        accent={accent}
      />

      <Slider
        label="字间距"
        value={style.letterSpacing}
        min={-0.1}
        max={0.5}
        step={0.01}
        unit="em"
        onChange={(v) => setter({ letterSpacing: Number(v.toFixed(2)) })}
        accent={accent}
      />
    </div>
  );
}
