import * as PIXI from 'pixi.js';
import generateModel from './utilities/generate-model';
import forEachElement from './utilities/forEachElement';
import initForm from './utilities/formControl';

const app = new PIXI.Application({
	view: document.getElementById('pixi-canvas'),
	backgroundColor: '#303030',
	height: window.innerHeight,
	width: window.innerWidth,
	antialias: true
});

const layers = [ 2, 4, 2, 2 ];
const { neurons, weights } = generateModel(layers);

initForm('csv-form', 'file-input');

forEachElement(neurons, (element) => app.stage.addChild(element));
forEachElement(weights, (element) => app.stage.addChild(element));
