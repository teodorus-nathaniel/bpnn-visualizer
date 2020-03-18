import * as PIXI from 'pixi.js';
import PixiPlugin from 'gsap/PixiPlugin';
import gsap from 'gsap';
import initModelController from './controllers/network-model-control';
import initInputDataListeners from './controllers/input-data-control';
import initModalControl from './controllers/input-modal-control';
import initInputTypeChangeListener from './controllers/input-type-control';

document.addEventListener('DOMContentLoaded', () => {
	PixiPlugin.registerPIXI(PIXI);
	gsap.registerPlugin(PixiPlugin);

	const app = new PIXI.Application({
		view: document.getElementById('pixi-canvas'),
		backgroundColor: 0x000000,
		height: window.innerHeight,
		width: window.innerWidth,
		antialias: true
	});

	app.stage.sortableChildren = true;

	initModelController(app.stage);
	initInputDataListeners();
	initModalControl();
	initInputTypeChangeListener();

	// const layers = [ 2, 4, 2, 10, 2 ];

	// const { neurons, weights } = generateModel(app.stage, layers);
	// startBPNN(neurons, weights, 1);

	// initForm('csv-form', 'file-input');

	// forEachElement(neurons, (element) => app.stage.addChild(element));
	// forEachElement(weights, (element) => app.stage.addChild(element));
});
