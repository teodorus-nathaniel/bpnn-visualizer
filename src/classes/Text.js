import * as PIXI from 'pixi.js';

export default class Text extends PIXI.Text {
	constructor(text, stage, timeline, pos) {
		super(text.toString().substr(0, 4), {
			align: 'center',
			fontFamily: 'Arial',
			fontSize: 14,
			fill: 0xffffff
		});

		this.stage = stage;

		this.timeline = timeline;
		this.pos = pos;

		this.renderComponent();
		this.animate();
	}

	animate() {
		this.timeline
			.to(this, { duration: 2, pixi: { alpha: 1 } }, 'fadingIn')
			.to(
				this,
				{
					duration: 20,
					pixi: { alpha: 1 }
				},
				'show'
			)
			.to(
				this,
				{
					duration: 2,
					onComplete: () => this.destroy(),
					pixi: { alpha: 0 }
				},
				'fadingOut'
			);
	}

	renderComponent() {
		const { x, y } = this.pos;
		this.anchor.set(0.5);

		this.alpha = 0;

		this.setTransform(x, y - 30);
		this.stage.addChild(this);
	}
}
