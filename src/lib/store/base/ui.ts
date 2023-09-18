import use from "../../utils/use";

class Ui {
  scale = 1;

  offsetX = 0;

  offsetY = 0;

  width = 0;

  height = 0;

  previewText = "Hello World!\nHello Snow Bamboo!"; // /\r\n|\r|\n/

  selectLetter = "";

  selectNextLetter = "";

  showPreview = false;

  previewScale = 1;

  previewOffsetX = 0;

  previewOffsetY = 0;

  packFailed = false;

  constructor(ui: Partial<Ui> = {}) {
    if (ui.previewText) {
      this.previewText = ui.previewText;
    }
  }

  reOffset() {
    this.offsetX = Math.min(
      Math.max(this.width / -2, this.offsetX),
      this.width / 2,
    );
    this.offsetY = Math.min(
      Math.max(this.height / -2, this.offsetY),
      this.height / 2,
    );
    this.scale = Math.max(this.scale, 0.01);
  }

  setTransform(trans: Partial<Ui>): void {
    this.scale = use.num(trans.scale, this.scale);
    this.offsetX = use.num(trans.offsetX, this.offsetX);
    this.offsetY = use.num(trans.offsetY, this.offsetY);
    this.reOffset();
  }

  setSize(width: number, height: number): void {
    this.width = width;
    this.height = height;
    this.reOffset();
  }

  setPreviewText(text: string): void {
    this.previewText = text;
  }

  setShowPreview(showPreview: boolean): void {
    this.showPreview = showPreview;
  }

  setPreviewTransform(trans: Partial<Ui>): void {
    this.previewScale = Math.max(
      use.num(trans.previewScale, this.previewScale),
      0.01,
    );
    this.previewOffsetX = use.num(trans.previewOffsetX, this.previewOffsetX);
    this.previewOffsetY = use.num(trans.previewOffsetY, this.previewOffsetY);
  }

  setSelectLetter(letter: string = "", next: string = ""): void {
    this.selectLetter = letter;
    this.selectNextLetter = next;
  }

  setPackFailed(packFailed: boolean): void {
    this.packFailed = packFailed;
  }
}

export default Ui;
