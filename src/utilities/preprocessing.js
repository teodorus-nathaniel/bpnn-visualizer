import * as math from 'mathjs';

function minData (arr){
  return math.min(arr, 0);
}
function maxData (arr){
  return math.max(arr, 0);
}
function minmaxScaler (number, min, max){
  return (number - min) / (max - min);
}

export function minmaxScale (dataNumber){
  let min = minData(dataNumber);
  let max = maxData(dataNumber);

  let newDataNumber = [];
  for (let i = 0; i < dataNumber.length; i++) {
    newDataNumber.push([]);
    for (let j = 0; j < dataNumber[i].length; j++) {
      newDataNumber[i][j] = minmaxScaler(dataNumber[i][j], min[j], max[j]);
    }
  }

  return newDataNumber;
}

export function oneHotEncode (target){
  const uniques = new Set(target);

  const mapper = {};
  uniques.forEach((val) => {
    if (!mapper[val]) {
      mapper[val] = { key: Object.values(mapper).length + 1, val };
    }
  });

  return {
    transform () {
      if (uniques.size <= 2) {
        return target.map((val) => [ mapper[val].key - 1 ]);
      }

      let newTarget = math.zeros([ target.length, uniques.size ])._data;
      target.forEach((val, idx) => (newTarget[idx][mapper[val].key - 1] = 1));

      return newTarget;
    },
    inverse_transform (data) {
      return mapper[data] ? mapper[data].val : 'None';
    }
  };
}
