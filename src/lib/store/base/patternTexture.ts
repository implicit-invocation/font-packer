import base64ToArrayBuffer from "../../utils/base64ToArrayBuffer";
import use from "../../utils/use";

export type Repetition = "repeat" | "repeat-x" | "repeat-y" | "no-repeat";

const DEFAULT_IMAGE =
  "iVBORw0KGgoAAAANSUhEUgAAAAgAAAAIAQMAAAD+wSzIAAAABlBMVEX////MzMw46qqDAAAADklEQVQI12Pgh8IPEAgAEeAD/Xk4HBcAAAAASUVORK5CYII=";

class PatternTexture {
  buffer: ArrayBuffer = base64ToArrayBuffer(DEFAULT_IMAGE);

  image: HTMLImageElement | null = null;

  src = "";

  repetition: Repetition = "repeat";

  scale: number;

  constructor(pt: Partial<PatternTexture> = {}) {
    this.scale = use.num(pt.scale, 1);
    this.repetition = pt.repetition || "repeat";
    this.setImage(pt.buffer || this.buffer);
  }

  setImage(buffer: ArrayBuffer): void {
    const src = URL.createObjectURL(new Blob([buffer]));
    const img = new Image();
    img.onload = () => {
      this.buffer = buffer;
      this.image = img;
      this.src = src;
      img.onload = null;
    };
    img.src = src;
  }

  setRepetition(repetition: Repetition): void {
    this.repetition = repetition;
  }

  setScale(scale: number): void {
    this.scale = scale;
  }
}

export default PatternTexture;
