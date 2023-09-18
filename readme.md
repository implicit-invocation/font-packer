# font-packer

a simple canvas-based TTF/OTF to bitmapfont packer

## Installation

```
npm install font-packer
```

## Usage

```Typescript
import { packFont, toBmfString } from "font-packer";

const { textureData, info } = await packFont("./YOUR-FONT.TTF", {
  fill: "black",
});

// draw the font texture to a canvas
const canvas = document.createElement("canvas");
canvas.width = textureData.width;
canvas.height = textureData.height;

const ctx = canvas.getContext("2d")!;
ctx.putImageData(textureData.data, 0, 0);

document.body.appendChild(canvas);

// get the bmfont data in txt format
console.log(toBmfString(info));

// get the bmfont data in json format
console.log(JSON.stringify(info, null, 2))
```
