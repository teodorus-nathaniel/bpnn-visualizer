import * as PIXI from 'pixi.js';
import { getHypotenuse } from '../utilities/math-utilities';

export default class WeightParticle extends PIXI.Graphics {
	constructor(
		stage,
		timeline,
		from,
		to,
		reverse,
		particleWidth = 4,
		particleColor = 0x3fffff
	) {
		super();

		this.stage = stage;

		this.timeline = timeline;
		this.from = from;
		this.to = to;
		this.particleWidth = particleWidth;

		if (reverse) {
			particleColor = 0xcccccccc;
		}
		this.particleColor = particleColor;

		this.renderComponent(reverse);
		this.animate(reverse);
	}

	_getDist() {
		return {
			x: this.to.x - this.from.x,
			y: this.to.y - this.from.y
		};
	}

	animate(reverse) {
		let dist = this._getDist();
		const hypotenuse = Math.sqrt(Math.pow(dist.x, 2) + Math.pow(dist.y, 2));
		dist = {
			x: dist.x - 25 * dist.x / hypotenuse,
			y: dist.y - 25 * dist.y / hypotenuse
		};

		if (reverse) {
			dist.x = -dist.x;
			dist.y = -dist.y;
		}

		this.timeline
			.to(this, { duration: 5, pixi: { alpha: 0.75 } }, 'fadingIn')
			.to(
				this,
				{
					duration: 25,
					pixi: { ...dist }
				},
				'beginForwardPass'
			)
			.to(
				this,
				{
					duration: 5,
					onComplete: () => this.destroy(),
					pixi: { alpha: 0 }
				},
				'fadingOut'
			);
	}

	getDegree(x, y) {
		return Math.sinh(y / x) * (180 / Math.PI);
	}

	renderComponent(reverse) {
		this.clear();
		this.alpha = 0;

		const dist = this._getDist();
		const hypotenuse = getHypotenuse(dist.x, dist.y);

		if (reverse) {
			const distScaledDown = {
				x: -25 * dist.x / hypotenuse,
				y: -25 * dist.y / hypotenuse
			};

			this.lineStyle(this.particleWidth, this.particleColor)
				.moveTo(this.to.x, this.to.y)
				.lineTo(this.to.x + distScaledDown.x, this.to.y + distScaledDown.y);
		} else {
			const distScaledDown = {
				x: 25 * dist.x / hypotenuse,
				y: 25 * dist.y / hypotenuse
			};

			this.lineStyle(this.particleWidth, this.particleColor)
				.moveTo(this.from.x, this.from.y)
				.lineTo(this.from.x + distScaledDown.x, this.from.y + distScaledDown.y);
		}

		this.stage.addChild(this);
	}
}
