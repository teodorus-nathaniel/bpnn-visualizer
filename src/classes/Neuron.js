import * as PIXI from 'pixi.js';

export default class Neuron extends PIXI.Graphics {
  constructor (
    stage,
    pos,
    value,
    radius = 15,
    colorPositive = 0x96c37b,
    colorNegative = 0xba7879,
    backgroundColor = 0x191c26
  ) {
    super();

    this.stage = stage;
    this.value = value;
    this.pos = pos;
    this.colorPositive = colorPositive;
    this.colorNegative = colorNegative;
    this.backgroundColor = backgroundColor;
    this.radius = radius;

    this.initializeContainer();
    this.renderComponent();
  }

  initializeContainer () {
    const container = new PIXI.Container();
    container.addChild(this);
    container.zIndex = 9;
    // container.filters = [
    //     new DropShadowFilter({
    //         alpha: this.value,
    //         color: color,
    //         blur: 0.2,
    //         distance: 0,
    //         quality: 10
    //     }),
    //     new DropShadowFilter({
    //         alpha: this.value,
    //         color: color,
    //         blur: 0.5,
    //         distance: 0,
    //         quality: 10
    //     })
    // ];

    this.container = container;
    this.stage.addChild(container);
  }

  renderComponent () {
    const { x, y } = this.pos;
    this.clear();

    // this.beginFill(0x0f0f0f, 0).drawRect(x - 50, y - 50, 100, 100).endFill();
    this.beginFill(this.backgroundColor)
      .drawCircle(x, y, this.radius)
      .endFill();

    const color = this.value > 0 ? 0x96c37b : 0xba7879;
    this.beginFill(color, Math.abs(this.value))
      .drawCircle(x, y, this.radius)
      .endFill();
    this.lineStyle(1, 0xffffff).drawCircle(x, y, this.radius);
  }
}
