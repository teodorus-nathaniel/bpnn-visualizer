import { getNextDimension } from '../utilities/array-utilities';
import gsap from 'gsap';

let timeline;
let animationSpeed = 9;

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

export default async function startBPNN (neurons, weights, maxEpoch = 50){
  const numLayers = neurons.length;

  document
    .getElementById('animation-slider')
    .addEventListener('change', function (){
      animationSpeed = this.value;
      if (timeline) {
        gsap.to(timeline, { timeScale: animationSpeed });
      }
    });

  for (let i = 0; i < maxEpoch; i++) {
    for (let j = 0; j < numLayers - 1; j++) {
      await forwardPass(weights[j]);
    }
  }
}
