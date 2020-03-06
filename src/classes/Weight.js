import * as PIXI from 'pixi.js';
import ParticleWeight from './ParticleWeight';

export default class Weight extends PIXI.Graphics {
	constructor(stage, from, to, value, lineWidth = 2, lineColor = 0xffffff) {
		super();

		this.stage = stage;
		this.from = from;
		this.to = to;
		this.lineWidth = lineWidth;
		this.lineColor = lineColor;

		this.value = value;

		this.renderComponent();
	}

	animateParticle(timeline, speed) {
		new ParticleWeight(this.stage, timeline, this.from, this.to, speed);
	}

	renderComponent(opacity = 1) {
		this.clear();

		this.lineStyle(this.lineWidth, this.lineColor, opacity)
			.moveTo(this.from.x, this.from.y)
			.lineTo(this.to.x, this.to.y);

		this.stage.addChild(this);
	}
}
