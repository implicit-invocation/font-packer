import use from "../../utils/use";

class Layout {
  padding = 1;

  spacing = 1;

  width = 512;

  height = 512;

  auto = true;

  fixedSize = false;

  constructor(layout: Partial<Layout> = {}) {
    this.padding = use.num(layout.padding, 1);

    this.spacing = use.num(layout.spacing, 1);

    this.width = use.num(layout.width, 512);

    this.height = use.num(layout.height, 512);

    // Compatible with old files, default true.
    this.auto = layout.auto === false ? false : true;

    this.fixedSize = !!layout.fixedSize;
  }

  setPadding(padding: number): void {
    this.padding = padding;
  }

  setSpacing(spacing: number): void {
    this.spacing = spacing;
  }

  setWidth(width: number): void {
    this.width = width;
  }

  setHeight(height: number): void {
    this.height = height;
  }

  setAuto(auto: boolean): void {
    this.auto = auto;
  }

  setFixedSize(fixedSize: boolean): void {
    this.fixedSize = fixedSize;
  }
}

export default Layout;
