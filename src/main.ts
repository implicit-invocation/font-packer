import { packFont, toBmfString } from "./lib";

const run = async () => {
  const buffer = await fetch("./JOMHURIA-REGULAR.TTF").then((res) =>
    res.arrayBuffer()
  );
  const { info, textureData } = await packFont(buffer, {
    name: "jomhuria",
    size: 72,
    padding: 1,
    spacing: 1,
    stroke: {
      width: 1,
      fill: "#193288",
      lineCap: "round",
      lineJoin: "round",
    },
    shadow: {
      offsetX: 1,
      offsetY: 1,
      blur: 1,
      fill: "#193288",
    },
  });
  const canvas = document.createElement("canvas");
  canvas.width = textureData.width;
  canvas.height = textureData.height;
  document.body.appendChild(canvas);
  const ctx = canvas.getContext("2d")!;
  ctx.putImageData(textureData.data, 0, 0);

  const pre = document.createElement("pre");
  pre.innerText = toBmfString(info);
  document.body.appendChild(pre);
};

run();
