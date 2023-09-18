class Metric {
  xAdvance = 0;

  xOffset = 0;

  yOffset = 0;

  constructor(metric: Partial<Metric> = {}) {
    this.xAdvance = metric.xAdvance || 0;
    this.xOffset = metric.xOffset || 0;
    this.yOffset = metric.yOffset || 0;
  }

  setXAdvance(xAdvance: number): void {
    this.xAdvance = xAdvance;
  }

  setXOffset(xOffset: number): void {
    this.xOffset = xOffset;
  }

  setYOffset(yOffset: number): void {
    this.yOffset = yOffset;
  }
}

export default Metric;
