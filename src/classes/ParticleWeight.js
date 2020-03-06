import * as PIXI from 'pixi.js';

export default class ParticleWeight extends PIXI.Graphics {
	constructor(
		stage,
		timeline,
		from,
		to,
		animationSpeed = 2,
		particleWidth = 4,
		particleColor = 0x0000ff
	) {
		super();

		this.stage = stage;

		this.timeline = timeline;
		this.from = from;
		this.to = to;
		this.animationSpeed = animationSpeed;
		this.particleWidth = particleWidth;
		this.particleColor = particleColor;

		this.renderComponent();
		this.animate();
	}

	_getDist() {
		return {
			x: this.to.x - this.from.x,
			y: this.to.y - this.from.y
		};
	}

	animate() {
		const dist = this._getDist();

		this.timeline
			.to(this, { duration: 2, pixi: { alpha: 1 } }, 'fadingIn')
			.to(
				this,
				{
					duration: 5,
					pixi: { ...dist }
				},
				'beginForwardPass'
			)
			.to(
				this,
				{
					duration: 1,
					onComplete: () => this.destroy(),
					pixi: { alpha: 0 }
				},
				'fadingOut'
			);
	}

	renderComponent() {
		this.clear();

		this.alpha = 0;

		/**
		 * TODO: kalo pake ini mau bkin panjang ada shadow nya jadi keliatan kek neon jalan
		 */
		// const dist = this._getDist();
		// const distScaledDown = {
		// 	x: 7,
		// 	y: 2 * dist.y / dist.x
		// };
		// this.lineStyle(this.particleWidth, this.particleColor)
		// 	.moveTo(this.from.x, this.from.y)
		// 	.lineTo(this.from.x + distScaledDown.x, this.from.y + distScaledDown.y);

		this.beginFill(0xff00ff);
		this.drawCircle(this.from.x, this.from.y, 3);
		this.endFill();

		this.stage.addChild(this);
	}
}
