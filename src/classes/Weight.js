import * as PIXI from 'pixi.js';

export default class Weight extends PIXI.Graphics {
	constructor(from, to, value, lineWidth = 2, lineColor = 0xffffff) {
		super();

		this.from = from.getNeuronRightBounds();
		this.to = to.getNeuronLeftBounds();
		this.lineWidth = lineWidth;
		this.lineColor = lineColor;

		this.value = value;

		this.renderComponent();
	}

	renderComponent(opacity = 1) {
		this.clear();

		this.lineStyle(this.lineWidth, this.lineColor, opacity)
			.moveTo(this.from.x, this.from.y)
			.lineTo(this.to.x, this.to.y);
	}
}
