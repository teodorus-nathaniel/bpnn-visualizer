import * as PIXI from 'pixi.js';
import { DropShadowFilter } from '@pixi/filter-drop-shadow';

export default class Neuron extends PIXI.Graphics {
  constructor (stage, pos, value, radius = 15, color = 0x1fffff) {
    super();

    this.stage = stage;
    this.value = value;
    this.pos = pos;
    this.color = color;
    this.radius = radius;

    this.initializeContainer();
    this.renderComponent();
  }

  initializeContainer () {
    const color = 0x1fffff;
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

    this.beginFill(0x0f0f0f, 0).drawRect(x - 50, y - 50, 100, 100).endFill();
    this.beginFill(0x0f0f0f).drawCircle(x, y, this.radius).endFill();
    this.beginFill(this.color, this.value)
      .drawCircle(x, y, this.radius)
      .endFill();
  }
}
