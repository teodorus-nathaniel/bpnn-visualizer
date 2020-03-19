import generateModel from '../utilities/generate-model';
import startBPNN from '../core/bpnn-animation';
import { getDataset } from './input-data-control';

const layerInputContainer = document.getElementById('neuron-inputs');
const layerInput = document.getElementsByClassName('input-neuron-count');
const layerCountInput = document.getElementById('layer-count-input');
const startButton = document.getElementById('start-btn');

const overlayIcons = document.getElementsByClassName('overlay-icons');
const canvas = document.getElementById('pixi-canvas');

let layers = [ 2, 2, 1 ];

export default function initModelController (stage){
  let network;
  const resetModel = () => {
    stage.removeChildren();
    network = generateModel(stage, layers);
  };

  function updateLayer (value, idx){
    if (layers[idx] === value) return;
    layers[idx] = value;
    resetModel();
  }

  function initNeuronInputListener (){
    Array.from(layerInput).forEach((input, idx) => {
      input.addEventListener('change', function (){
        updateLayer(+this.value, idx);
      });
    });
  }

  resetModel();
  initNeuronInputListener();

  layerCountInput.addEventListener('change', function (){
    const layerCount = +this.value;
    if (layers.length < layerCount) {
      for (let i = 0; i < layerCount - layers.length; i++) layers.push(3);
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

  startButton.addEventListener('click', () => {
    const [ titles, data ] = getDataset();
    console.log(titles, data);
    if (!data) return;
    canvas.classList.add('full-screen');
    Array.from(overlayIcons).forEach((el) => el.classList.add('show'));
    startBPNN(network);
  });
}
