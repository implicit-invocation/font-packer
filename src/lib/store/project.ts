import { GuillotineBinPack } from "rectangle-packer";

import { GlyphType } from "./base/glyphBase";
import GlyphFont from "./base/glyphFont";
import GlyphImage, { FileInfo } from "./base/glyphImage";
import Layout from "./base/layout";
import Metric from "./base/metric";
import Style from "./base/style";
import Ui from "./base/ui";

interface Rectangle {
  width: number;
  height: number;
  x: number;
  y: number;
  letter: string;
}

const STOP = 0;
const DO_PLACING = 1;
const INCREASE = 2;
const REDUCE = 3;

function maxMin(list: Rectangle[]) {
  const widthList = list.map((item) => item.width);
  const heightList = list.map((item) => item.height);
  return {
    minWidth: Math.min.apply(null, widthList),
    minHeight: Math.min.apply(null, heightList),
    maxWidth: widthList.reduce((a, b) => a + b, 0),
    maxHeight: heightList.reduce((a, b) => a + b, 0),
  };
}

function packing(list: Rectangle[]) {
  const sizes = maxMin(list);
  let min = Math.max(sizes.minWidth, sizes.minHeight);
  let max = Math.max(sizes.maxWidth, sizes.maxHeight);
  let state = DO_PLACING;
  let placed: Rectangle[] = [];
  while (state) {
    switch (state) {
      case DO_PLACING:
        const packer = new GuillotineBinPack<Rectangle>(
          min + Math.ceil((max - min) / 2),
          min + Math.ceil((max - min) / 2)
        );
        packer.InsertSizes([...list], true, 1, 1);
        if (max - min < 2) {
          state = STOP;
        } else if (list.length > packer.usedRectangles.length) {
          state = INCREASE;
        } else {
          placed = packer.usedRectangles;
          state = REDUCE;
        }
        break;
      case INCREASE:
        min += Math.ceil((max - min) / 2);
        state = DO_PLACING;
        break;
      case REDUCE:
        max -= Math.floor((max - min) / 2);
        state = DO_PLACING;
        break;
    }
  }
  return placed;
}

interface TextRectangle {
  width: number;
  height: number;
  x: number;
  y: number;
  letter: string;
  type: GlyphType;
}

class Project {
  name = "Unnamed";

  id: number;

  packStart = 0;

  packTimer = 0;

  isPacking = false;

  text =
    "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ!№;%:?*()_+-=.,/|\"'@#$^&{}[]";

  glyphs: Map<string, GlyphFont> = new Map();

  glyphImages: GlyphImage[] = [];

  style: Style;

  layout: Layout;

  globalAdjustMetric: Metric;

  packCanvas: HTMLCanvasElement | null = null;

  ui: Ui = new Ui();

  constructor(project: Partial<Project> = {}) {
    this.id = project.id || Date.now();
    this.name = project.name || "Unnamed";
    this.text = project.text || this.text;
    this.ui = new Ui(project.ui);
    this.style = new Style(project.style);
    this.layout = new Layout(project.layout);
    this.globalAdjustMetric = new Metric(project.globalAdjustMetric);

    if (project.glyphs) {
      project.glyphs.forEach((value, key) => {
        this.glyphs.set(key, new GlyphFont(value, this.style));
      });
    }

    project.glyphImages?.forEach((img) => {
      this.glyphImages.push(new GlyphImage(img));
    });

    if (!this.glyphs.has(" "))
      this.glyphs.set(" ", new GlyphFont({ letter: " " }, this.style));

    this.addGlyphs(project.text || "");
  }

  get glyphList(): (GlyphFont | GlyphImage)[] {
    const obj: { [key: string]: GlyphImage } = {};

    this.glyphImages.forEach((glyph) => {
      if (glyph.letter && glyph.selected) {
        obj[glyph.letter] = glyph;
      }
    });

    return ` ${this.text}`.split("").map((letter) => {
      if (obj[letter]) return obj[letter];
      return this.glyphs.get(letter) as GlyphFont;
    });
  }

  get rectangleList(): TextRectangle[] {
    const { padding, spacing } = this.layout;
    return this.glyphList
      .filter((glyph) => !!glyph)
      .map((glyph) => {
        const isUnEmpty = !!(glyph.width && glyph.height);
        return {
          letter: glyph.letter,
          type: glyph.type,
          width: isUnEmpty ? glyph.width + padding * 2 + spacing : 0,
          height: isUnEmpty ? glyph.height + padding * 2 + spacing : 0,
          x: 0,
          y: 0,
        };
      });
  }

  pack(): void {
    this.isPacking = true;
    const packList = this.rectangleList.sort((a, b) => b.height - a.height);
    const packer = new GuillotineBinPack<TextRectangle>(
      this.layout.width + this.layout.spacing,
      this.layout.height + this.layout.spacing
    );

    if (!this.layout.auto) {
      const list = packList.filter(({ width, height }) => !!(width && height));

      packer.InsertSizes(list, true, 1, 1);

      this.setPack(packer.usedRectangles, list);

      this.isPacking = false;
      return;
    }
    const rectangles = packing(
      packList.filter(({ width, height }) => !!(width && height))
    );
    this.setPack(rectangles as any);
  }

  setPack(list: TextRectangle[], failedList?: TextRectangle[]): void {
    const imgList = this.glyphImages;
    let maxWidth = 0;
    let maxHeight = 0;
    const { auto, fixedSize, width, height, spacing } = this.layout;

    list.forEach((rectangle) => {
      const { letter, x, y, type, width, height } = rectangle;
      let glyph: GlyphFont | GlyphImage | undefined;

      if (type === "image") {
        glyph = imgList.find((gi) => {
          if (gi && gi.letter === letter) return true;
          return false;
        });
      }

      if (!glyph) {
        glyph = this.glyphs.get(letter);
      }

      if (glyph) {
        glyph.x = x || 0;
        glyph.y = y || 0;
      }

      maxWidth = Math.max(maxWidth, x + width);
      maxHeight = Math.max(maxHeight, y + height);
    });

    if (failedList?.length) {
      failedList.forEach((rectangle) => {
        const { letter, type } = rectangle;
        let glyph: GlyphFont | GlyphImage | undefined;

        if (type === "image") {
          glyph = imgList.find((gi) => {
            if (gi && gi.letter === letter) return true;
            return false;
          });
        }

        if (!glyph) {
          glyph = this.glyphs.get(letter);
        }

        if (glyph) {
          glyph.x = 0;
          glyph.y = 0;
        }
      });
      this.ui.setPackFailed(true);
    } else {
      this.ui.setPackFailed(false);
    }

    if (!auto && fixedSize) {
      this.ui.setSize(width, height);
      return;
    }

    this.ui.setSize(maxWidth - spacing, maxHeight - spacing);
  }

  packStyle() {
    this.isPacking = true;

    const tasks: GlyphFont[] = [];

    this.glyphs.forEach((glyph) => {
      tasks.push(glyph);
    });

    // TODO: may consider using worker or idle callback
    while (tasks.length) {
      const glyph = tasks.shift();
      if (glyph) glyph.setGlyphInfo(this.style);
    }

    this.pack();
  }

  setText(str: string): void {
    const oldText = this.text;
    this.text = str.replace(/\s/gm, "");
    this.addGlyphs(oldText);
  }

  addGlyphs(oldText = ""): void {
    const currentList = Array.from(new Set(this.text.split("")));
    const oldList = Array.from(new Set(oldText.split("")));
    this.text = currentList.join("");
    const diffList = oldText
      ? Array.from(new Set(currentList.concat(oldList))).filter(
          (t) => !(currentList.includes(t) && oldList.includes(t))
        )
      : currentList;

    if (!diffList.length) return;

    diffList.forEach((letter) => {
      if (currentList.includes(letter)) {
        this.glyphs.set(letter, new GlyphFont({ letter }, this.style));
      } else {
        // in diff
        this.glyphs.delete(letter);
      }
    });
  }

  addImages<T extends FileInfo>(list: T[]): void {
    Promise.all(
      list.map((img) => {
        const glyphImage = new GlyphImage(img);
        this.glyphImages.push(glyphImage);
        return glyphImage.initImage();
      })
    ).then(this.pack);
  }

  removeImage(image: GlyphImage): void {
    const idx = this.glyphImages.indexOf(image);
    if (idx > -1) this.glyphImages.splice(idx, 1);
  }

  setCanvas(canvas: HTMLCanvasElement): void {
    this.packCanvas = canvas;
  }

  setName(name: string): void {
    this.name = name || this.name;
  }
}

export default Project;
