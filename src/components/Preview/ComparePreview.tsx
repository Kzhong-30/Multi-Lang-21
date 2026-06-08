import { useFontStore } from '../../store/useFontStore';
import { PreviewCanvas } from './PreviewCanvas';

export function ComparePreview() {
  const fontA = useFontStore((s) => s.fontA);
  const fontB = useFontStore((s) => s.fontB);
  const styleA = useFontStore((s) => s.styleA);
  const styleB = useFontStore((s) => s.styleB);
  const compareMode = useFontStore((s) => s.compareMode);

  if (!compareMode) {
    return (
      <PreviewCanvas
        label="主预览 · 字体 A"
        font={fontA}
        style={styleA}
        accent="accent"
      />
    );
  }

  return (
    <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
      <PreviewCanvas
        label="字体 A · 标题"
        font={fontA}
        style={styleA}
        accent="accent"
      />
      <PreviewCanvas
        label="字体 B · 正文"
        font={fontB}
        style={styleB}
        accent="mint"
      />
    </div>
  );
}
