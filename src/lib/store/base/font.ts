import { Font as OpenType, parse } from "opentype.js";
import getFontBaselines from "../../utils/getFontBaselines";
import getTextBaselines from "../../utils/getTextBaselines";
import is from "../../utils/is";
import updateFontFace from "../../utils/updateFontFace";

export interface FontResource {
  font: ArrayBuffer;
  family: string;
  opentype: OpenType;
}

const DEFAULT_FAMILY = "sans-serif";

class Font {
  fonts: FontResource[] = [];

  size: number;

  // TODO: LINEHEIGHT
  lineHeight = 1;

  middle = 0;

  hanging = 0;

  top = 0;

  alphabetic = 0;

  ideographic = 0;

  bottom = 0;

  sharp = 80;

  get mainFont() {
    if (this.fonts.length > 0) return this.fonts[0];
    return null;
  }

  get mainFamily() {
    if (this.mainFont) return this.mainFont.family;
    return DEFAULT_FAMILY;
  }

  get opentype() {
    if (this.mainFont) return this.mainFont.opentype;
    return null;
  }

  get family(): string {
    return (
      this.fonts.map((fontResource) => `"${fontResource.family}"`).join(",") ||
      DEFAULT_FAMILY
    );
  }

  get minBaseLine() {
    const min = Math.min(
      this.middle,
      this.hanging,
      this.top,
      this.alphabetic,
      this.ideographic,
      this.bottom,
    );
    if (Number.isNaN(Number(min))) return 0;
    return min;
  }

  get maxBaseLine() {
    const max = Math.max(
      this.middle,
      this.hanging,
      this.top,
      this.alphabetic,
      this.ideographic,
      this.bottom,
    );
    if (Number.isNaN(Number(max))) return this.size;
    return max;
  }

  constructor(font: Partial<Font> = {}) {
    this.size = font.size || 72;
    // TODO: LINEHEIGHT
    this.lineHeight = font.lineHeight || 1.25;
    this.sharp = is.num(font.sharp) ? font.sharp : 80;
    if (font.fonts && font.fonts.length) {
      font.fonts.forEach((fontResource) => this.addFont(fontResource.font));
    } else {
      this.updateBaseines();
    }
  }

  updateBaseines(): void {
    let bls;
    if (this.mainFont?.opentype) {
      bls = getFontBaselines(this.mainFont.opentype, this.size);
    } else {
      bls = getTextBaselines("x", {
        fontFamily: this.family,
        fontSize: this.size,
      });
    }
    // TODO: LINEHEIGHT
    this.lineHeight = bls.lineHeight;
    this.middle = bls.middle;
    this.hanging = bls.hanging;
    this.top = bls.top;
    this.alphabetic = bls.alphabetic;
    this.ideographic = bls.ideographic;
    this.bottom = bls.bottom;
  }

  async addFont(font: ArrayBuffer): Promise<void> {
    let opentype: OpenType;

    opentype = parse(font);

    const { names } = opentype;
    const family = names.postScriptName[Object.keys(names.postScriptName)[0]];
    const hasFont = this.fonts.find(
      (fontResource) => fontResource.family === family,
    );
    if (hasFont) {
      throw new Error("Font already exists.");
    }
    const url = URL.createObjectURL(new Blob([font]));

    await updateFontFace(family, url);

    this.fonts.push({
      font,
      family,
      opentype,
    });
    this.updateBaseines();
  }

  removeFont(fontResource: FontResource) {
    const idx = this.fonts.indexOf(fontResource);
    if (idx === -1) return;
    this.fonts.splice(idx, 1);
    if (idx === 0) {
      this.updateBaseines();
    }
  }

  setSize(size: number): void {
    this.size = size;
    this.updateBaseines();
  }

  // TODO: LINEHEIGHT
  setLineHeight(lineHeight: number): void {
    this.lineHeight = lineHeight;
  }

  setSharp(sharp: number): void {
    this.sharp = sharp;
  }
}

export default Font;
