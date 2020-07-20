import * as PIXI from 'pixi.js';
import WeightParticle from './WeightParticle';
import Text from './Text';

export default class Weight extends PIXI.Graphics {
  constructor (
    stage,
    from,
    to,
    value,
    lineWidth = 1.5,
    colorPositive = 0x96c37b,
    colorNegative = 0xba7879
  ) {
    super();

    this.stage = stage;
    this.from = from;
    this.to = to;
    this.lineWidth = lineWidth;
    this.colorPositive = colorPositive;
    this.colorNegative = colorNegative;

    this.value = value;

    this.renderComponent();
    this.initInteractive();
  }

  animateParticle (timeline) {
    new WeightParticle(this.stage, timeline, this.from, this.to);
  }

  animateParticleReverse (timeline) {
    new WeightParticle(this.stage, timeline, this.from, this.to, true);
  }

  updateValue (value) {
    this.prevValue = this.value;
    this.value = value;
  }

  initInteractive () {
    this.interactive = true;
    this.hitArea = new PIXI.Polygon(
      new PIXI.Point(this.from.x, this.from.y - 10),
      new PIXI.Point(this.to.x, this.to.y - 10),
      new PIXI.Point(this.to.x, this.to.y + 10),
      new PIXI.Point(this.from.x, this.from.y + 10)
    );

    let text = null;
    const dist = {
      x: this.to.x - this.from.x,
      y: this.to.y - this.from.y
    };

    const middle = {
      x: this.from.x + dist.x / 2,
      y: this.from.y + dist.y / 2
    };

    this.mouseover = function (){
      text = new Text(
        this.value.toString().substr(0, 8),
        this.stage,
        middle,
        undefined,
        Math.atan2(dist.y, dist.x),
        15
      );
    };

    this.mouseout = function (){
      if (text) {
        text.fadeOut();
      }
    };
  }

  showValue (timeline) {
    const dist = {
      x: this.to.x - this.from.x,
      y: this.to.y - this.from.y
    };

    const middle = {
      x: this.from.x + dist.x / 3.5,
      y: this.from.y + dist.y / 3.5
    };

    new Text(
      `${this.prevValue
        .toString()
        .substr(0, 4)} -> ${this.value.toString().substr(0, 4)}`,
      this.stage,
      middle,
      timeline,
      Math.atan2(dist.y, dist.x),
      15
    );
  }

  renderComponent () {
    this.clear();

    const color = this.value > 0 ? this.colorPositive : this.colorNegative;

    this.lineStyle(this.lineWidth, color, Math.abs(this.value))
      .moveTo(this.from.x, this.from.y)
      .lineTo(this.to.x, this.to.y);

    this.stage.addChild(this);
  }
}
