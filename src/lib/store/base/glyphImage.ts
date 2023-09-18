import getTrimImageInfo from "../../utils/getTrimImageInfo";

import GlyphBase, { GlyphType } from "./glyphBase";

export interface FileInfo {
  letter?: string;
  fileName: string;
  fileType: string;
  buffer: ArrayBuffer;
}

class GlyphImage extends GlyphBase {
  readonly type: GlyphType = "image";

  src = ""; // 仅显示列表中

  buffer: ArrayBuffer | null = null;

  fileName = "";

  fileType = "";

  selected = true;

  constructor(glyphImage: Partial<GlyphImage>) {
    super(glyphImage);
    this.letter = glyphImage.letter || "";
    this.fileName = glyphImage.fileName || "";
    this.fileType = glyphImage.fileType || "";
    this.buffer = glyphImage.buffer || null;
    if (glyphImage.buffer) {
      this.src = URL.createObjectURL(new Blob([glyphImage.buffer]));
      this.initImage();
    }
  }

  initImage(): Promise<void> {
    return new Promise((resolve) => {
      const image = new Image();
      image.onload = () => {
        const { naturalWidth, naturalHeight } = image;
        this.fontWidth = naturalWidth;
        this.fontHeight = naturalHeight;

        const trimInfo = getTrimImageInfo(image);
        this.width = trimInfo.width;
        this.height = trimInfo.height;
        this.trimOffsetLeft = trimInfo.trimOffsetLeft;
        this.trimOffsetTop = trimInfo.trimOffsetTop;
        this.trimOffsetRight =
          trimInfo.width - trimInfo.trimOffsetLeft - naturalWidth;
        this.trimOffsetBottom =
          trimInfo.height - trimInfo.trimOffsetTop - naturalHeight;

        this.source = trimInfo.canvas;
        resolve();
      };
      image.src = this.src;
    });
  }

  setGlyph(text: string): void {
    this.letter = text[0] || "";
  }

  changeSelect(isSelect: boolean): void {
    this.selected = isSelect;
  }
}

export default GlyphImage;
