import * as PIXI from 'pixi.js';
import WeightParticle from './WeightParticle';

export default class Weight extends PIXI.Graphics {
	constructor(
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
	}

	animateParticle(timeline) {
		new WeightParticle(this.stage, timeline, this.from, this.to);
	}

	renderComponent() {
		this.clear();

		const color = this.value > 0 ? this.colorPositive : this.colorNegative;

		this.lineStyle(this.lineWidth, color, Math.abs(this.value))
			.moveTo(this.from.x, this.from.y)
			.lineTo(this.to.x, this.to.y);

		this.stage.addChild(this);
	}
}
