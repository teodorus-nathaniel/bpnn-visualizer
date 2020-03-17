import getFeatureTitleComponent from '../components/feature-title';
import getInputDataComponent from '../components/input-data';
import getInputRowDataComponent from '../components/input-row-data';

const dataContainer = document.getElementById('data');
const titleContainer = document.getElementById('features-titles');
const addNewFeatureBtn = document.getElementById('add-new-feature');
const addNewDataBtn = document.getElementById('add-new-data');

export default function initInputDataListeners() {
	addNewFeatureBtn.addEventListener('click', () => {
		const titles = titleContainer.children;
		const datas = dataContainer.children;

		const lastFeatureIndex = titles.length - 3;

		const insertAfter = titles[lastFeatureIndex];
		insertAfter.insertAdjacentHTML(
			'afterend',
			getFeatureTitleComponent(lastFeatureIndex + 2)
		);

		Array.from(datas).forEach((data) => {
			console.log('object');
			const children = data.children;
			const insertAfter = children[lastFeatureIndex];
			insertAfter.insertAdjacentHTML('afterend', getInputDataComponent());
		});
	});

	addNewDataBtn.addEventListener('click', () => {
		const featuresLength = titleContainer.children.length - 1;
		dataContainer.insertAdjacentHTML(
			'beforeend',
			getInputRowDataComponent(featuresLength)
		);
	});
}
