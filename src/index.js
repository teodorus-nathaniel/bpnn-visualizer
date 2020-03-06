import * as PIXI from 'pixi.js';
import Neuron from './classes/Neuron';
import Weight from './classes/Weight';

const app = new PIXI.Application({
	view: document.getElementById('pixi-canvas'),
	backgroundColor: '#303030',
	height: window.innerHeight,
	width: window.innerWidth,
	antialias: true
});

const LAYER_COUNT = 3;
const X_GAP = window.innerWidth / (LAYER_COUNT + 1);

const layers = {
	input: 2,
	hidden: 4,
	output: 2
};

const mapNeurons = (_, idx, arr, xGap) =>
	new Neuron({
		x: xGap,
		y: (idx + 1) * window.innerHeight / (arr.length + 1)
	});

const inputNeurons = Array.from({ length: layers.input }).map((...params) =>
	mapNeurons(...params, X_GAP * 1)
);
const hiddenNeurons = Array.from({ length: layers.hidden }).map((...params) =>
	mapNeurons(...params, X_GAP * 2)
);
const outputNeurons = Array.from({ length: layers.output }).map((...params) =>
	mapNeurons(...params, X_GAP * 3)
);

const inputWeights = [];
for (let i = 0; i < layers.input; i++) {
	for (let j = 0; j < layers.hidden; j++) {
		if (!inputWeights[i]) inputWeights[i] = [];
		inputWeights[i][j] = new Weight(inputNeurons[i], hiddenNeurons[j], 50);
	}
}
const hiddenWeights = [];
for (let i = 0; i < layers.hidden; i++) {
	for (let j = 0; j < layers.output; j++) {
		if (!hiddenWeights[i]) hiddenWeights[i] = [];
		hiddenWeights[i][j] = new Weight(hiddenNeurons[i], outputNeurons[j], 50);
	}
}

app.stage.addChild(...inputNeurons);
inputWeights.forEach((weights) => app.stage.addChild(...weights));
app.stage.addChild(...hiddenNeurons);
hiddenWeights.forEach((weights) => app.stage.addChild(...weights));
app.stage.addChild(...outputNeurons);
