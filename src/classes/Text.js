import * as PIXI from 'pixi.js';
import gsap from 'gsap/gsap-core';

export default class Text extends PIXI.Text {
	constructor(text, stage, pos, timeline) {
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

		if (!timeline) {
			this.fadeIn();
		} else this.animate();
	}

	fadeIn() {
		gsap.to(this, { duration: 1, pixi: { alpha: 1 } });
	}

	fadeOut() {
		gsap.to(this, {
			duration: 1,
			pixi: { alpha: 0 },
			onComplete: () => this.destroy()
		});
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
