import * as PIXI from 'pixi.js';
import generateModel, {
	generateNeurons,
	generateWeights
} from './utilities/generate-model';
import stageComponents from './utilities/stage-components';

const app = new PIXI.Application({
	view: document.getElementById('pixi-canvas'),
	backgroundColor: '#303030',
	height: window.innerHeight,
	width: window.innerWidth,
	antialias: true
});

const layers = [ 2, 4, 2 ];
const { neurons, weights } = generateModel(layers);

stageComponents(app.stage, neurons);
stageComponents(app.stage, weights);
