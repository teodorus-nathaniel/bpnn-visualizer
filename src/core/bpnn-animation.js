import {
  getNextDimension,
  getDataExceptColumn,
  forEachElement
} from '../utilities/array-utilities';
import gsap from 'gsap';
import BPNN from '../model/bpnn';
import { minmaxScale, oneHotEncode } from '../utilities/preprocessing';

let timeline;
let animationSpeed = 19;
let endAnimation = false;
let encoder;

const currentEpochLabel = document.getElementById('current-epoch');

function forwardPass (weights){
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

function backwardPass (weights){
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

function updateNeuronValues (neurons, neuronValues){
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

function updateNeuronOutputValues (neurons, neuronValues, target){
  return new Promise((resolve) => {
    timeline = new gsap.timeline({ onComplete: resolve });
    gsap.to(timeline, { timeScale: animationSpeed });

    // TODO: cari argmax dari tiap itu, trs yang indexnya bener di correct in

    neurons.forEach((neuron, i) => {
      neuron.value = neuronValues._data[i];
      neuron.renderComponent();
      neuron.showValue(timeline, `${neuron.value} --> ${target[i]}`);
    });
  });
}

function updateWeightValues (weights, newWeights){
  return new Promise((resolve) => {
    timeline = new gsap.timeline({ onComplete: resolve });
    gsap.to(timeline, { timeScale: animationSpeed });

    weights.forEach((weight, i) => {
      weight.forEach((w, j) => {
        w.updateValue(newWeights[i][j]);
        w.renderComponent();
        w.showValue(timeline);
      });
    });
  });
}

export function animationSpeedListener (){
  animationSpeed = this.value;
  if (timeline) {
    gsap.to(timeline, { timeScale: animationSpeed });
  }
}

export function stopAnimation (){
  endAnimation = true;
  if (timeline) timeline.kill();
}

export function startAnimation (){
  endAnimation = false;
}

export default async function startBPNN (network, dataset, maxEpoch = 50){
  const numLayers = network.layers.length;
  let target = getNextDimension(dataset, dataset[0].length - 1);
  let input = getDataExceptColumn(dataset, dataset[0].length - 1);

  input = input.map((x) => x.map((y) => parseFloat(y)));

  input = minmaxScale(input);

  encoder = oneHotEncode(target);
  target = encoder.transform();

  console.log({ input, target });

  const learningRate = document.getElementById('learning-rate-input').value;
  const activation = document.getElementById('activation-input').value;
  const epoch = document.getElementById('epoch-input').value;

  const bpnnModel = new BPNN(
    network.layers,
    input,
    target,
    undefined,
    undefined,
    learningRate,
    activation
  );

  const bpnn = bpnnModel.train(epoch);

  let res;
  for (let i = 0; i < maxEpoch; i++) {
    if (endAnimation) {
      break;
    }

    currentEpochLabel.textContent = i + 1;

    forEachElement(network.neurons, (neuron) => {
      neuron.resetValue();
    });

    res = bpnn.next();
    const { neuronValues, newWeights, newBiases, error, target } = res.value;

    await new Promise((resolve) => {
      const timeline = gsap.timeline({ onComplete: resolve });

      gsap.to(timeline, { timeScale: animationSpeed });
      network.neurons[0].forEach((neuron, i) => {
        neuron.value = neuronValues[0]._data[i];
        neuron.renderComponent();
        neuron.showValue(timeline);
      });
    });

    if (endAnimation) {
      break;
    }

    for (let j = 0; j < numLayers - 1; j++) {
      await forwardPass(network.weights[j]);
      if (j !== numLayers - 2) {
        await updateNeuronValues(network.neurons[j + 1], neuronValues[j + 1]);
      } else {
        await updateNeuronOutputValues(
          network.neurons[j + 1],
          neuronValues[j + 1],
          target
        );
      }
    }

    if (endAnimation) {
      break;
    }

    for (let j = numLayers - 2; j >= 0; j--) {
      await backwardPass(network.weights[j]);
      await updateWeightValues(network.weights[j], newWeights[j]);
    }
  }
}
