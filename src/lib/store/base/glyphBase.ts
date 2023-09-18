import Metric from "./metric";

export type GlyphType = "text" | "image";

class GlyphBase {
  readonly type: GlyphType = "text";

  letter = "";

  source: HTMLImageElement | HTMLCanvasElement | null = null;

  width = 0;

  height = 0;

  x = 0;

  y = 0;

  fontWidth = 0;

  fontHeight = 0;

  trimOffsetTop = 0;

  trimOffsetLeft = 0;

  trimOffsetRight = 0;

  trimOffsetBottom = 0;

  adjustMetric: Metric;

  kerning: Map<string, number> = new Map();

  constructor(glyph: Partial<GlyphBase> = {}) {
    this.letter = glyph.letter || "";
    this.adjustMetric = new Metric(glyph.adjustMetric);

    if (glyph.kerning) {
      this.kerning = glyph.kerning;
    }
  }

  steKerning(text: string, kerning: number) {
    this.kerning.set(text, kerning);
  }
}

export default GlyphBase;
