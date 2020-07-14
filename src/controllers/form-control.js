import Papa from "papaparse";
import * as math from "mathjs";
import { getDataExceptColumn } from "../utilities/array-utilities";

function processData(results) {
  let data = math.matrix(results.data.slice(0, results.data.length - 1));
  data = data._data;
  data.splice(0, 1);

  getDataExceptColumn(data, data[0].length - 1);
  let dataNumber = data.map((x) => x.map((y) => parseFloat(y)));

  let min = minData(dataNumber);
  let max = maxData(dataNumber);

  let newDataNumber = [];
  for (let i = 0; i < dataNumber.length; i++) {
    newDataNumber.push([]);
    for (let j = 0; j < dataNumber[i].length; j++) {
      newDataNumber[i][j] = minmaxScaler(dataNumber[i][j], min[j], max[j]);
    }
  }
}

function minData(arr) {
  return math.min(arr, 0);
}
function maxData(arr) {
  return math.max(arr, 0);
}
function minmaxScaler(number, min, max) {
  return (number - min) / (max - min);
}

export default function initForm() {
  document.getElementById("csv-file").addEventListener("change", function (e) {
    const file = this.files[0];
    const ext = file.name.split(".").pop();
    if (ext === "csv") {
      Papa.parse(file, {
        complete: processData,
      });
    } else {
      var error = document.getElementsByClassName("error-message")[0];
      error.innerHTML = "Invalid Extension";
      error.style.color = "red";
    }
  });
}
