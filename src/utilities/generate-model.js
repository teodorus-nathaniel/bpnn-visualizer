import Neuron from '../classes/Neuron';
import Weight from '../classes/Weight';

const mapNeurons = (_, idx, arr, stage, xGap, height) =>
	new Neuron(stage, {
		x: xGap,
		y: (idx + 1) * height / (arr.length + 1)
	});

export function generateNeurons(stage, neuronCount, xPosition, height) {
	return Array.from({ length: neuronCount }).map((...params) =>
		mapNeurons(...params, stage, xPosition, height)
	);
}

export function generateWeights(stage, neuronFrom, neuronTo) {
	const weights = [];
	for (let i = 0; i < neuronFrom.length; i++) {
		for (let j = 0; j < neuronTo.length; j++) {
			if (!weights[i]) weights[i] = [];
			weights[i][j] = new Weight(stage, neuronFrom[i].pos, neuronTo[j].pos, 50);
		}
	}
	return weights;
}

export default function generateModel(
	stage,
	layers,
	width = window.innerWidth,
	height = window.innerHeight
) {
	const X_GAP = width / (layers.length + 1);

	const neurons = [];
	layers.forEach((neuronCount, idx) => {
		neurons[idx] = generateNeurons(
			stage,
			neuronCount,
			X_GAP * (idx + 1),
			height
		);
	});

	const weights = [];
	for (let i = 0; i < layers.length - 1; i++) {
		weights[i] = generateWeights(stage, neurons[i], neurons[i + 1]);
	}

	return {
		neurons,
		weights
	};
}
