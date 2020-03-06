import * as PIXI from 'pixi.js';
import WeightParticle from './WeightParticle';

export default class Weight extends PIXI.Graphics {
  constructor (stage, from, to, value, lineWidth = 1, lineColor = 0xffffff) {
    super();

    this.stage = stage;
    this.from = from;
    this.to = to;
    this.lineWidth = lineWidth;
    this.lineColor = lineColor;

    this.value = value;

    this.renderComponent();
  }

  animateParticle (timeline, speed) {
    new WeightParticle(this.stage, timeline, this.from, this.to, speed);
  }

  renderComponent () {
    this.clear();

    this.lineStyle(this.lineWidth, this.lineColor, this.value)
      .moveTo(this.from.x, this.from.y)
      .lineTo(this.to.x, this.to.y);

    this.stage.addChild(this);
  }
}
