import * as math from 'mathjs';

export default class BPNN {
  constructor (
    layers,
    inp,
    target,
    w,
    b,
    learningRate = 1,
    activation = 'sigmoid'
  ) {
    this.layers = layers;
    this.inp = inp;
    this.target = target;
    this.learningRate = learningRate;

    if (activation === 'tanh') {
      this.activation = (val) =>
        (math.exp(val) - math.exp(-val)) / (math.exp(val) + math.exp(-val));
    } else if (activation === 'relu') {
      this.activation = (val) => (val > 0 ? val : 0);
    } else {
      this.activation = (val) => 1 / (1 + math.exp(-val));
    }

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
    let sigmas = sigmaNextLayer;

    if (weights) {
      sigmas = math.multiply(
        math.reshape(math.clone(sigmaNextLayer), [
          1,
          sigmaNextLayer.size()[0]
        ]),
        math.transpose(math.clone(weights))
      );
      sigmas = math.reshape(math.clone(sigmas), [ sigmas.size()[1] ]);
    }

    sigmas = math.dotMultiply(
      math.dotMultiply(sigmas, math.subtract(1, neurons)),
      neurons
    );

    return sigmas._data;
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
              neuronValues[i].subset(math.index(k));
        });
      });
    });

    this.b.forEach((biasesPerLayer, i) => {
      biasesPerLayer.forEach((bias, j) => {
        this.b[i][j] = bias + this.learningRate * sigma[i + 1][j] * 1;
      });
    });
  }

  *train () {
    const errors = [];

    let i = 0;
    while (true) {
      console.log(`EPOCH ${i + 1}: `);
      let currentError = 0;
      for (let j = 0; j < this.inp.length; j++) {
        const trainData = this.inp[j];
        const target = this.target[j];

        const neuronValues = this._getOutput(trainData);
        console.log(`   
          output: ${neuronValues[neuronValues.length - 1]}
          target: ${target}`);

        const mseError = math.mean(
          this.applyToEveryElement(
            math.subtract(target, neuronValues[neuronValues.length - 1]),
            (val) => 0.5 * Math.pow(val, 2)
          )
        );
        currentError += mseError;

        const error = math.subtract(
          target,
          neuronValues[neuronValues.length - 1]
        );

        console.log({ neuronValues, error });

        this._updateModel(neuronValues, error);

        yield {
          neuronValues,
          newWeights: this.w,
          newBiases: this.b,
          error: mseError,
          target,
          epoch: i + 1,
          dataIndex: j + 1,
          dataMax: this.inp.length
        };
      }

      console.log(
        `   ERROR: ${math.divide(currentError, this.inp.length)}\n\n`
      );
      errors.push(currentError / this.inp.length);
      i++;
    }
  }
}
