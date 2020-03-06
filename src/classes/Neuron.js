import * as PIXI from 'pixi.js';
import gsap from 'gsap';

export default class Neuron extends PIXI.Graphics {
	constructor(stage, pos, value, radius = 15, color = 0xffffff) {
		super();

		this.stage = stage;
		this.value = value;
		this.pos = pos;
		this.color = color;
		this.radius = radius;

		// this.animate();
		this.renderComponent();
	}

	getNeuronRightBounds() {
		const { x, y } = this.pos;
		return { x: x + this.radius, y };
	}

	getNeuronLeftBounds() {
		const { x, y } = this.pos;
		return { x: x - this.radius, y };
	}

	renderComponent(opacity = 1) {
		const { x, y } = this.pos;
		this.clear();

		this.beginFill(this.color);
		this.drawCircle(x, y, this.radius);
		this.endFill();

		this.stage.addChild(this);
	}
}
