import Papa from 'papaparse';
import { matrix } from 'mathjs';
let csvFileData = [];

export function getCsvData (){
  return csvFileData.map((val) => val.map((el) => el));
}

function processData (results){
  let data = matrix(results.data.slice(0, results.data.length - 1));
  data = data._data;
  data.splice(0, 1);
  csvFileData = data;
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
