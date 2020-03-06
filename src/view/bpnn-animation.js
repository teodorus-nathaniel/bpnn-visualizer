import { getNextDimension } from '../utilities/array-utilities';
import gsap from 'gsap';

function forwardPass(weights) {
	return new Promise((resolve) => {
		const timeline = new gsap.timeline({ onComplete: resolve });

		const nextNeuronCount = weights[0].length;
		for (let i = 0; i < nextNeuronCount; i++) {
			const weightsToNextNeuron = getNextDimension(weights, i);
			weightsToNextNeuron.forEach((weight) => weight.animateParticle(timeline));
		}
	});
}

export default async function startBPNN(neurons, weights, maxEpoch = 50) {
	const numLayers = neurons.length;

	for (let i = 0; i < maxEpoch; i++) {
		for (let j = 0; j < numLayers - 1; j++) {
			await forwardPass(weights[j]);
		}
	}
}
