import Neuron from '../classes/Neuron';
import Weight from '../classes/Weight';

const mapNeurons = (_, idx, arr, xGap, height) =>
	new Neuron({
		x: xGap,
		y: (idx + 1) * height / (arr.length + 1)
	});

export function generateNeurons(neuronCount, xPosition, height) {
	return Array.from({ length: neuronCount }).map((...params) =>
		mapNeurons(...params, xPosition, height)
	);
}

export function generateWeights(neuronFrom, neuronTo) {
	const weights = [];
	for (let i = 0; i < neuronFrom.length; i++) {
		for (let j = 0; j < neuronTo.length; j++) {
			if (!weights[i]) weights[i] = [];
			weights[i][j] = new Weight(neuronFrom[i], neuronTo[j], 50);
		}
	}
	return weights;
}

export default function generateModel(
	layers,
	width = window.innerWidth,
	height = window.innerHeight
) {
	const X_GAP = width / (layers.length + 1);

	const neurons = [];
	layers.forEach((neuronCount, idx) => {
		neurons[idx] = generateNeurons(neuronCount, X_GAP * (idx + 1), height);
	});

	const weights = [];
	for (let i = 0; i < layers.length - 1; i++) {
		weights[i] = generateWeights(neurons[i], neurons[i + 1]);
	}

	return {
		neurons,
		weights
	};
}
