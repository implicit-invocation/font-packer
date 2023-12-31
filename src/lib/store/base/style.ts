import Fill from "./fill";
import Font from "./font";
import Shadow from "./shadow";
import Stroke from "./stroke";

class Style {
  readonly font: Font;

  readonly fill: Fill;

  useStroke: boolean;

  readonly stroke: Stroke;

  useShadow: boolean;

  readonly shadow: Shadow;

  bgColor = "rgba(0,0,0,0)";

  constructor(style: Partial<Style> = {}) {
    this.font = new Font(style.font);
    this.fill = new Fill(style.fill);
    this.stroke = new Stroke(style.stroke);
    this.shadow = new Shadow(style.shadow);
    this.useShadow = !!style.useShadow;
    this.useStroke = !!style.useStroke;
  }

  setUseStroke(useStroke: boolean): void {
    this.useStroke = useStroke;
  }

  setUseShadow(useShadow: boolean): void {
    this.useShadow = useShadow;
  }

  setBgColor(bgColor: string): void {
    this.bgColor = bgColor;
  }
}

export default Style;
