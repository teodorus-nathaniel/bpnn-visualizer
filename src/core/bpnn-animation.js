import {
	getNextDimension,
	getDataExceptColumn,
	forEachElement
} from '../utilities/array-utilities';
import gsap from 'gsap';
import BPNN from '../model/bpnn';

let timeline;
let animationSpeed = 19;

function forwardPass(weights) {
	return new Promise((resolve) => {
		timeline = new gsap.timeline({ onComplete: resolve });
		gsap.to(timeline, { timeScale: animationSpeed });

		const nextNeuronCount = weights[0].length;
		for (let i = 0; i < nextNeuronCount; i++) {
			const weightsToNextNeuron = getNextDimension(weights, i);
			weightsToNextNeuron.forEach((weight) => weight.animateParticle(timeline));
		}
	});
}

function backwardPass(weights) {
	return new Promise((resolve) => {
		timeline = new gsap.timeline({ onComplete: resolve });
		gsap.to(timeline, { timeScale: animationSpeed });

		const nextNeuronCount = weights[0].length;
		for (let i = 0; i < nextNeuronCount; i++) {
			const weightsToNextNeuron = getNextDimension(weights, i);
			weightsToNextNeuron.forEach((weight) =>
				weight.animateParticleReverse(timeline)
			);
		}
	});
}

function updateNeuronValues(neurons, neuronValues) {
	return new Promise((resolve) => {
		timeline = new gsap.timeline({ onComplete: resolve });
		gsap.to(timeline, { timeScale: animationSpeed });

		neurons.forEach((neuron, i) => {
			neuron.value = neuronValues._data[i];
			neuron.renderComponent();
			neuron.showValue(timeline);
		});
	});
}

function updateWeightValues(weights, newWeights) {
	return new Promise((resolve) => {
		timeline = new gsap.timeline({ onComplete: resolve });
		gsap.to(timeline, { timeScale: animationSpeed });

		weights.forEach((weight, i) => {
			weight.forEach((w, j) => {
				w.value = newWeights[i][j];
				w.renderComponent();
				// w.showValue(timeline);
			});
		});
	});
}

export default async function startBPNN(network, dataset, maxEpoch = 50) {
	const numLayers = network.layers.length;
	const target = getNextDimension(dataset, dataset[0].length - 1);
	const input = getDataExceptColumn(dataset, dataset[0].length - 1);

	const bpnnModel = new BPNN(network.layers, input, target);
	const bpnn = bpnnModel.train(2000);

	let res;
	for (let i = 0; i < maxEpoch; i++) {
		forEachElement(network.neurons, (neuron) => {
			neuron.resetValue();
		});

		res = bpnn.next();
		const { neuronValues, newWeights, newBiases, error } = res.value;

		await new Promise((resolve) => {
			const timeline = gsap.timeline({ onComplete: resolve });
			gsap.to(timeline, { timeScale: animationSpeed });
			network.neurons[0].forEach((neuron, i) => {
				neuron.value = neuronValues[0]._data[i];
				neuron.renderComponent();
				neuron.showValue(timeline);
			});
		});

		for (let j = 0; j < numLayers - 1; j++) {
			await forwardPass(network.weights[j]);
			await updateNeuronValues(network.neurons[j + 1], neuronValues[j + 1]);
		}

		for (let j = numLayers - 2; j >= 0; j--) {
			await backwardPass(network.weights[j]);
			await updateWeightValues(network.weights[j], newWeights[j]);
		}
	}
}
