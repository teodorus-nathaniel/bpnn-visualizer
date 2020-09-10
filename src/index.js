import * as PIXI from 'pixi.js';
import initModelController from './controllers/network-model-control';
import initInputDataListeners from './controllers/input-data-control';
import initInputTypeChangeListener from './controllers/input-type-control';
import initForm from './controllers/form-control';
import initVisualizeData from './controllers/visualize';

document.addEventListener('DOMContentLoaded', () => {
  PixiPlugin.registerPIXI(PIXI);
  gsap.registerPlugin(PixiPlugin);

  const app = new PIXI.Application({
    view: document.getElementById('pixi-canvas'),
    backgroundColor: 0x191c26,
    height: window.innerHeight,
    width: window.innerWidth,
    antialias: true
  });

  app.stage.sortableChildren = true;

  initModelController(app.stage);
  initInputDataListeners();
  initInputTypeChangeListener();
  initForm();
  initVisualizeData();
});
