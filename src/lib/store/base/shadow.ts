import use from "../../utils/use";

class Shadow {
  color: string;

  blur = 1;

  offsetX = 1;

  offsetY = 1;

  constructor(shadow: Partial<Shadow> = {}) {
    this.color = shadow.color || "#000000";
    this.blur = use.num(shadow.blur, 1);
    this.offsetX = use.num(shadow.offsetX, 1);
    this.offsetY = use.num(shadow.offsetY, 1);
  }

  setColor(color: string): void {
    this.color = color;
  }

  setBlur(blur: number): void {
    this.blur = blur;
  }

  setOffsetX(offsetX: number): void {
    this.offsetX = offsetX;
  }

  setOffsetY(offsetY: number): void {
    this.offsetY = offsetY;
  }

  setOffset(offsetX: number, offsetY: number): void {
    this.offsetX = offsetX;
    this.offsetY = offsetY;
  }
}

export default Shadow;
