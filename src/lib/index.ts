import { BMFont, toBmfInfo } from "./file/export";
import { getString } from "./file/export/types/text";
import { Font, Layout, Metric, Style } from "./store/base";
import Fill from "./store/base/fill";
import Shadow from "./store/base/shadow";
import Stroke from "./store/base/stroke";
import Project from "./store/project";
export type { BMFont } from "./file/export";

export interface FontConfig {
  name: string;
  text: string;

  size: number;
  lineHeight: number;
  sharp: number;

  padding: number;
  spacing: number;
  autoSize: boolean;
  fixedSize: boolean;
  maxWidth: number;
  maxHeight: number;

  xAdvance: number;
  xOffset: number;
  yOffset: number;

  fill: string;

  stroke?: {
    width: number;
    fill: string;
    lineCap: CanvasLineCap;
    lineJoin: CanvasLineJoin;
  };

  shadow?: {
    offsetX: number;
    offsetY: number;
    blur: number;
    fill: string;
  };

  backgroundColor: string | undefined;
}

export const defaultConfig: FontConfig = {
  name: "Unnamed",
  text: "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ!№;%:?*()_+-=.,/|\"'@#$^&{}[]",

  backgroundColor: undefined,
  fill: "#ffffff",

  size: 64,
  lineHeight: 64,
  sharp: 80,

  autoSize: true,
  fixedSize: false,
  maxWidth: 512,
  maxHeight: 512,
  padding: 1,
  spacing: 1,

  xAdvance: 0,
  xOffset: 0,
  yOffset: 0,
};

export const toBmfString = (info: BMFont): string => {
  return getString(info);
};

export const packFont = async (
  trueTypeUrl?: string,
  config?: Partial<FontConfig>
): Promise<{
  textureData: {
    width: number;
    height: number;
    data: ImageData;
  };
  info: BMFont;
}> => {
  const fontConfig: FontConfig = { ...defaultConfig, ...config };

  const project = new Project({
    globalAdjustMetric: new Metric({
      xAdvance: fontConfig.xAdvance,
      xOffset: fontConfig.xOffset,
      yOffset: fontConfig.yOffset,
    }),
    layout: new Layout({
      auto: fontConfig.autoSize,
      fixedSize: fontConfig.fixedSize,
      width: fontConfig.maxWidth,
      height: fontConfig.maxHeight,
      padding: fontConfig.padding,
      spacing: fontConfig.spacing,
    }),
    style: new Style({
      font: new Font({
        size: fontConfig.size,
        lineHeight: fontConfig.lineHeight,
        sharp: fontConfig.sharp,
      }),
      useShadow: !!fontConfig.shadow,
      shadow: !!fontConfig.shadow
        ? new Shadow({
            offsetX: fontConfig.shadow?.offsetX || 0,
            offsetY: fontConfig.shadow?.offsetY || 0,
            blur: fontConfig.shadow?.blur || 0,
            color: fontConfig.shadow?.fill || "#000000",
          })
        : undefined,
      useStroke: !!fontConfig.stroke,
      stroke: !!fontConfig.stroke
        ? new Stroke({
            width: fontConfig.stroke?.width || 0,
            color: fontConfig.stroke?.fill || "#000000",
            lineCap: fontConfig.stroke?.lineCap || "round",
            lineJoin: fontConfig.stroke?.lineJoin || "round",
          })
        : undefined,
      fill: new Fill({
        color: fontConfig.fill,
      }),
    }),
  });
  if (config?.text) {
    project.setText(config.text);
  }
  if (config?.name) {
    project.setName(config.name);
  }

  if (trueTypeUrl) {
    const buffer = await fetch(trueTypeUrl).then((res) => res.arrayBuffer());
    await project.style.font.addFont(buffer);
  }
  project.packStyle();

  const padding = project.layout.padding;

  const canvas = document.createElement("canvas");
  canvas.width = project.ui.width;
  canvas.height = project.ui.height;

  const info = toBmfInfo(project);

  const ctx = canvas.getContext("2d")!;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  if (fontConfig.backgroundColor) {
    ctx.fillStyle = fontConfig.backgroundColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  // TODO: handle multipage?
  project.glyphList
    .filter((glyph) => !!glyph)
    .forEach((glyph) => {
      if (
        glyph.source &&
        glyph.source.width !== 0 &&
        glyph.source.height !== 0
      ) {
        ctx.drawImage(
          glyph.source as HTMLCanvasElement,
          glyph.x + (padding || 0),
          glyph.y + (padding || 0)
        );
      }
    });

  return {
    textureData: {
      width: canvas.width,
      height: canvas.height,
      data: ctx.getImageData(0, 0, canvas.width, canvas.height),
    },
    info,
  };
};
