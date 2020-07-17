import generateModel from '../utilities/generate-model';
import startBPNN, {
	animationSpeedListener,
	stopAnimation,
	startAnimation,
	startSkipAnimation
} from '../core/bpnn-animation';
import { getDataset } from './input-data-control';
import { getCsvData } from './form-control';
import {
	getNextDimension,
	getDataExceptColumn
} from '../utilities/array-utilities';
import { minmaxScale, oneHotEncode } from '../utilities/preprocessing';

const layerInputContainer = document.getElementById('neuron-inputs');
const layerInput = document.getElementsByClassName('input-neuron-count');
const layerCountInput = document.getElementById('layer-count-input');
const startButton = document.getElementById('start-btn');
const checkModelButton = document.getElementById('check-model-btn');

const overlayIcons = document.getElementsByClassName('overlay-icons');
const currentEpochLabel = document.getElementsByClassName('current-epoch')[0];
const canvas = document.getElementById('pixi-canvas');

let layers = [ 2, 2, 1 ];
let encoder;

function preprocessData(dataset) {
	let target = getNextDimension(dataset, dataset[0].length - 1);
	let input = getDataExceptColumn(dataset, dataset[0].length - 1);

	input = input.map((x) => x.map((y) => parseFloat(y)));

	input = minmaxScale(input);

	encoder = oneHotEncode(target);
	target = encoder.transform();

	return [ input, target ];
}

function getModelDataset() {
	const container = document.getElementById('input-form-container');

	let data;
	if (container.classList.contains('use-csv')) {
		data = getCsvData();
		if (!data || !data.length) {
			alert('Data is empty');
		}
	} else {
		const [ , customData ] = getDataset();
		data = customData;
	}

	if (!data || !data.length) return null;

	return data;
}

function shuffle(data) {
	data.sort(() => Math.random() - 0.5);
}

export function getEncoder() {
	return encoder;
}

export function getPreprocessedData(isShuffle) {
	const data = getModelDataset();
	if (!data) return [];

	if (isShuffle) shuffle(data);

	return preprocessData(data);
}

export default function initModelController(stage) {
	let network;
	const resetModel = () => {
		stage.removeChildren();
		network = generateModel(stage, layers);
	};

	function updateLayer(value, idx) {
		if (layers[idx] === value) return;
		layers[idx] = value;
		resetModel();
	}

	function initNeuronInputListener() {
		Array.from(layerInput).forEach((input, idx) => {
			input.addEventListener('change', function() {
				updateLayer(+this.value, idx);
			});
		});
	}

	resetModel();
	initNeuronInputListener();

	function getAndCheckDataset() {
		const [ input, target ] = getPreprocessedData(true);

		let text = '';
		if (input[0].length !== layers[0]) {
			text += `Input data is not compatible with dataset (suggested input layer neuron: ${input[0]
				.length})\n`;
		}
		if (target[0].length !== layers[layers.length - 1]) {
			text += `Output data is not compatible with the dataset (suggested output layer neuron: ${target[0]
				.length})\n`;
		}

		return { input, target, error: text };
	}

	checkModelButton.addEventListener('click', function() {
		const { error, input, target } = getAndCheckDataset();

		if (error) {
			if (confirm(`${error}Do you want to auto-fix your model?`)) {
				layers[0] = input[0].length;
				layers[layers.length - 1] = target[0].length;
				resetModel();
			}
		} else {
			alert('Model is compatible');
		}
	});

	layerCountInput.addEventListener('change', function() {
		const layerCount = +this.value;
		if (layers.length < layerCount) {
			const layerLength = layers.length;
			for (let i = 0; i < layerCount - layerLength; i++) {
				layers.push(3);
			}
		} else if (layers.length > layerCount) {
			layers = layers.slice(0, layerCount);
		} else return;

		layerInputContainer.innerHTML = Array.from({ length: layerCount }).reduce(
			(acc, _, idx) =>
				acc +
				`<input class="input-neuron-count" type="text" placeholder="layer ${idx +
					1}..." value="${layers[idx]}">`,
			''
		);

		resetModel();
		initNeuronInputListener();
	});

	const animationSliderContainer = document.getElementById('slide-container');

	startButton.addEventListener('click', () => {
		const { error, input, target } = getAndCheckDataset();
		if (error) {
			alert(error);
			return;
		}

		document.getElementById('plot').classList.add('hide');
		canvas.classList.add('full-screen');
		document.body.classList.add('full');
		animationSliderContainer.classList.remove('hide');
		Array.from(overlayIcons).forEach((el) => el.classList.add('show'));
		currentEpochLabel.classList.add('show');

		startAnimation();
		startBPNN(network, input, target, encoder);
	});

	document.getElementById('back-btn').addEventListener('click', function() {
		stopAnimation();
		resetModel();
		document.body.classList.remove('full');
		canvas.classList.remove('full-screen');
		animationSliderContainer.classList.add('hide');

		Array.from(overlayIcons).forEach((el) => el.classList.remove('show'));
		currentEpochLabel.classList.remove('show');
	});

	const skipEpoch = (epoch) => () => {
		startSkipAnimation(epoch);
	};
	document.getElementById('skip-10').addEventListener('click', skipEpoch(10));
	document.getElementById('skip-100').addEventListener('click', skipEpoch(100));
	document
		.getElementById('skip-1000')
		.addEventListener('click', skipEpoch(1000));

	const animationSlider = document.getElementById('animation-slider');
	animationSlider.addEventListener('change', animationSpeedListener);
}
