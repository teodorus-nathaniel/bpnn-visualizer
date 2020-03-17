// import math from 'mathjs';
const math = require('mathjs');

class BPNN {
  constructor (
    layers,
    inp,
    target,
    w,
    b,
    learningRate = 0.1,
    activation = (val) => 1 / (1 + math.exp(-val))
  ) {
    this.layers = layers;
    this.inp = inp;
    this.target = target;
    this.learningRate = learningRate;
    this.activation = activation;

    this._checkInput();

    if (!w || !b) this._initWeightsAndBiases();
    else {
      this.w = w;
      this.b = b;
    }
  }

  _initWeightsAndBiases () {
    this.w = [];
    this.b = [];
    for (let i = 0; i < this.layers.length - 1; i++) {
      this.w.push(math.random([ this.layers[i], this.layers[i + 1] ]));
      this.b.push(math.random([ this.layers[i + 1] ]));
    }
  }

  _checkInput () {
    if (this.inp[0].length != this.layers[0])
      throw new Error('The input layers and input dimension does not match!');
    else if (this.target[0].length != this.layers[this.layers.length - 1])
      throw new Error('The output layers and target dimension does not match!');
    else if (this.inp.length != this.target.length)
      throw new Error('The input and output data count does not match!');
  }

  applyToEveryElement (matrix, transform) {
    return matrix.map(function (value){
      if (value instanceof Object) {
        return applyToEveryElement(value, transform);
      }
      return transform(value);
    });
  }

  _forwardPass (x, layer_index) {
    return this.applyToEveryElement(
      math.add(
        math.multiply(math.matrix(x), math.matrix(this.w[layer_index])),
        this.b[layer_index]
      ),
      this.activation
    );
  }

  _getOutput (x) {
    const data = [];
    data.push(math.matrix(x));
    for (let i = 0; i < this.layers.length - 1; i++) {
      data.push(this._forwardPass(data[i], i));
    }
    return data;
  }

  _getSigma (neurons, sigmaNextLayer, weights) {
    sigmaNextLayer = math.matrix(sigmaNextLayer);
    neurons = math.matrix(neurons);
    if (weights) weights = math.matrix(weights);
    const sigmas = [];
    for (let i = 0; i < neurons.size()[0]; i++) {
      let multiplier = [];
      for (let j = 0; j < sigmaNextLayer.size()[0]; j++) {
        if (weights) {
          multiplier.push(
            math.multiply(
              weights.valueOf()[i][j],
              sigmaNextLayer.subset(math.index(j))
            )
          );
        } else {
          multiplier.push(sigmaNextLayer.subset(math.index(j)));
        }
      }

      multiplier = math.mean(multiplier);

      const sigma = math.multiply(
        math.multiply(
          neurons.subset(math.index(i)),
          1 - neurons.subset(math.index(i))
        ),
        multiplier
      );

      sigmas.push(sigma);
    }

    return sigmas;
  }

  _updateModel (neuronValues, error) {
    const sigma = [];
    sigma[neuronValues.length - 1] = this._getSigma(
      neuronValues[neuronValues.length - 1],
      error
    );

    for (let i = 2; i < neuronValues.length; i++) {
      sigma[sigma.length - i] = this._getSigma(
        neuronValues[neuronValues.length - i],
        sigma[sigma.length - i + 1],
        this.w[this.w.length - i + 1]
      );
    }

    this.w.forEach((weightsPerLayer, i) => {
      weightsPerLayer.forEach((weights, k) => {
        weights.forEach((weight, j) => {
          this.w[i][k][j] =
            weight +
            this.learningRate *
              sigma[i + 1][j] *
              neuronValues[i].subset(math.index(j));
        });
      });
    });

    this.b.forEach((biasesPerLayer, i) => {
      biasesPerLayer.forEach((bias, j) => {
        this.b[i][j] = bias + this.learningRate * sigma[i + 1][j] * 1;
      });
    });
  }

  train (maxEpoch = 1000) {
    const errors = [];

    for (let i = 0; i < maxEpoch; i++) {
      let mseError = 0;
      console.log(`EPOCH ${i + 1}: `);
      this.inp.forEach((trainData, j) => {
        const neuronValues = this._getOutput(trainData);

        mseError = math.add(
          this.applyToEveryElement(
            math.subtract(
              this.target[j],
              neuronValues[neuronValues.length - 1]
            ),
            (val) => 0.5 * Math.pow(val, 2)
          ),
          mseError
        );

        const error = math.subtract(
          this.target[j],
          neuronValues[neuronValues.length - 1]
        );

        this._updateModel(neuronValues, error);
      });

      console.log(`   ERROR: ${math.divide(mseError, this.inp.length)}\n\n`);
      errors.push(mseError / this.inp.length);
    }
  }
}

const layers = [ 2, 2, 1 ];
const inp = [ [ 1, 1 ] ];
const target = [ [ 0 ] ];
const w = [ [ [ 5, 4 ], [ 6, 3 ] ], [ [ 4 ], [ 2 ] ] ];
const b = [ [ -6, 1 ], [ -3.93 ] ];

// const model = new BPNN(layers, inp, target, w, b);
// model.train(2);
