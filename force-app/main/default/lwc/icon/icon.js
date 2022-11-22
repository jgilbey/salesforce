import { LightningElement, api } from "lwc";

export default class Icon extends LightningElement {
  @api icon;
  @api fill;
  @api stroke;
  hasRendered = false;

  get iconarrowsvg() {
    return this.icon == "iconarrowsvg";
  }

  renderedCallback() {
    if (this.hasRendered) return;
    this.hasRendered = true;
    if (this.fill || this.stroke) {
      let style = document.createElement("style");
      style.innerText = "c-icon svg .a {";
      if (this.fill) {
        style.innerText += "fill:" + this.fill + ";";
      }
      if (this.stroke) {
        style.innerText += "stroke:" + this.stroke + ";";
      }
      style.innerText += "}";
      this.template.querySelector(".icon").appendChild(style);
    }
  }
}