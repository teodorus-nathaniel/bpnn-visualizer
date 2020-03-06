import Papa from 'papaparse';
import * as math from 'mathjs';

function processData(results) {
	console.log(results);
	const data = math.matrix(results.data.slice(0, results.data.length - 1));

	// console.log('object');
	// data = math.matrix([ [ 1, 2, 3 ], [ 4, 5, 6 ], [ 7, 8, 9 ] ]);
	// console.log(data);

	const data1 = math.add(
		math.flatten(
			math.subset(data, math.index(math.range(1, data.size()[0]), [ 0 ]))
		),
		1
	);

	const max = Math.max(...data1._data);
	const min = Math.min(...data1._data);
}

export default function initForm(formId) {
	document.getElementById(formId).addEventListener('submit', function(e) {
		e.preventDefault();
		const file = document.getElementById('file-input').files[0];
		Papa.parse(file, {
			complete: processData
		});
	});
}
