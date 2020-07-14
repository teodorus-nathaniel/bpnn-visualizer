import * as PIXI from 'pixi.js';
import Text from './Text';

export default class Neuron extends PIXI.Graphics {
	constructor(
		stage,
		pos,
		value,
		radius = 15,
		colorPositive = 0x96c37b,
		colorNegative = 0xba7879,
		backgroundColor = 0x191c26
	) {
		super();

		this.stage = stage;
		this.value = value;
		this.pos = pos;
		this.colorPositive = colorPositive;
		this.colorNegative = colorNegative;
		this.backgroundColor = backgroundColor;
		this.radius = radius;

		this.initializeContainer();
		this.renderComponent();
		this.initInteractive();
	}

	initializeContainer() {
		const container = new PIXI.Container();
		container.addChild(this);
		container.zIndex = 9;

		this.container = container;
		this.stage.addChild(container);
	}

	showValue(timeline) {
		new Text(this.value, this.stage, this.pos, timeline);
	}

	resetValue() {
		this.value = 0;
		this.renderComponent();
	}

	initInteractive() {
		this.interactive = true;
		this.hitArea = new PIXI.Circle(this.pos.x, this.pos.y, this.radius);

		let text = null;
		this.mouseover = function() {
			text = new Text(this.value, this.stage, this.pos);
		};

		this.mouseout = function() {
			if (text) {
				text.fadeOut();
			}
		};
	}

	renderComponent() {
		const { x, y } = this.pos;
		this.clear();

		this.beginFill(this.backgroundColor)
			.drawCircle(x, y, this.radius)
			.endFill();

		const color = this.value > 0 ? 0x96c37b : 0xba7879;
		this.beginFill(color, Math.abs(this.value))
			.drawCircle(x, y, this.radius)
			.endFill();
		this.lineStyle(1, 0xffffff).drawCircle(x, y, this.radius);
	}
}
