import Papa from 'papaparse';
import * as math from 'mathjs';
import {
  getDataExceptColumn,
  getNextDimension
} from '../utilities/array-utilities';
import { minmaxScale } from '../utilities/preprocessing';

let csvFileData = [];

export function getCsvData (){
  return csvFileData;
}

function processData (results){
  let data = math.matrix(results.data.slice(0, results.data.length - 1));
  data = data._data;
  data.splice(0, 1);
  csvFileData = dataNumber;
}

export default function initForm (){
  document.getElementById('csv-file').addEventListener('change', function (e){
    const file = this.files[0];
    const ext = file.name.split('.').pop();
    if (ext === 'csv') {
      Papa.parse(file, {
        complete: processData
      });
    } else {
      var error = document.getElementsByClassName('error-message')[0];
      error.innerHTML = 'Invalid Extension';
      error.style.color = 'red';
    }
  });
}
