import { getPreprocessedData, getEncoder } from './network-model-control';
import { getNextDimension } from '../utilities/array-utilities';

export default function initVisualizeData() {
	document
		.getElementById('visualize-btn')
		.addEventListener('click', function() {
			const [ input, target ] = getPreprocessedData();
			if (input[0].length > 2) {
				alert('We cannot visualize data with more than 2 dimensions yet.');
				return;
			}
			const data = {};

			for (let i = 0; i < target.length; i++) {
				const real = getEncoder().inverse_transform(target[i]);
				if (!data[real]) data[real] = [];
				data[real].push(input[i]);
			}

			const plot = document.getElementById('plot');
			plot.classList.remove('hide');

			const points = [];
			Object.entries(data).forEach(([ key, val ]) => {
				points.push({
					x: getNextDimension(val, 0),
					y: getNextDimension(val, 1),
					mode: 'markers',
					type: 'scatter',
					name: key
				});
			});
			Plotly.newPlot(plot, points);
		});
}
