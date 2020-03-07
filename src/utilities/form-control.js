import Papa from "papaparse";
import * as math from "mathjs";

function processData(results) {
    console.log(results);
    const data = math.matrix(results.data.slice(0, results.data.length - 1));

    const data1 = math.add(
        math.flatten(
            math.subset(data, math.index(math.range(1, data.size()[0]), [0]))
        ),
        1
    );

    const max = Math.max(...data1._data);
    const min = Math.min(...data1._data);
}

export default function initForm(formId) {
    document.getElementById(formId).addEventListener("submit", function(e) {
        e.preventDefault();
        const file = document.getElementById("file-input").files[0];
        const ext = file.name.split(".").pop();
        if (ext === "csv") {
            Papa.parse(file, {
                complete: processData
            });
        } else {
            var error = document.getElementsByClassName("error-message")[0];
            error.innerHTML = "Invalid Extension";
            error.style.color = "red";
        }
    });
}
