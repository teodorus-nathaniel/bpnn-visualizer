import * as PIXI from 'pixi.js';
import generateModel from './utilities/generate-model';
import { forEachElement } from './utilities/array-utilities';
import initForm from './utilities/form-control';
import PixiPlugin from 'gsap/PixiPlugin';
import gsap from 'gsap';
import startBPNN from './core/bpnn-animation';
import initModelController from './core/network-model-controller';
import bpnn from './core/bpnn-calculation';
import initInputDataListeners from './utilities/input-data-control';

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

// const layers = [ 2, 4, 2, 10, 2 ];

// const { neurons, weights } = generateModel(app.stage, layers);
// startBPNN(neurons, weights, 1);

initForm('csv-form', 'file-input');

// forEachElement(neurons, (element) => app.stage.addChild(element));
// forEachElement(weights, (element) => app.stage.addChild(element));
