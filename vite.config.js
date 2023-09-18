// vite.config.js
import { resolve } from "path";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

export default defineConfig({
  build: {
    lib: {
      // Could also be a dictionary or array of multiple entry points
      entry: resolve(__dirname, "src/lib/index.ts"),
      name: "FontPacker",
      // the proper extensions will be added
      fileName: "font-packer",
    },
    copyPublicDir: false,
  },
  plugins: [dts({ include: ["src/lib"] })],
});
