import { getNextDimension } from '../utilities/array-utilities';
import gsap from 'gsap';
import BPNN from '../model/bpnn';

let timeline;
let animationSpeed = 9;

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

export default async function startBPNN(network, maxEpoch = 50) {
	const numLayers = network.layers.length;

	// TODO: uncomment when added animation speed slider
	// document
	// 	.getElementById('animation-slider')
	// 	.addEventListener('change', function() {
	// 		animationSpeed = this.value;
	// 		if (timeline) {
	// 			gsap.to(timeline, { timeScale: animationSpeed });
	// 		}
	// 	});

	const bpnnModel = new BPNN(
		network.layers,
		[ [ 1, 1 ], [ 1, 0 ], [ 0, 1 ], [ 0, 0 ] ],
		[ [ 1 ], [ 1 ], [ 1 ], [ 0 ] ]
	);
	const bpnn = bpnnModel.train();

	let res;
	do {
		res = bpnn.next();
		console.log(res);
		for (let j = 0; j < numLayers - 1; j++) {
			await forwardPass(network.weights[j]);
		}
	} while (!res.done);
}
