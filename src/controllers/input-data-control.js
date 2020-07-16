import getFeatureTitleComponent from '../components/feature-title';
import getInputDataComponent from '../components/input-data';
import getInputRowDataComponent from '../components/input-row-data';

const dataContainer = document.getElementById('data');
const titleContainer = document.getElementById('features-titles');
const addNewFeatureBtn = document.getElementById('add-new-feature');
const addNewDataBtn = document.getElementById('add-new-data');
const modal = document.getElementById('custom-input-modal');

const inputDimensionRowText = document.getElementById('input-dimension--row');
const inputDimensionColumnText = document.getElementById(
	'input-dimension--column'
);

function initDeleteDataset() {
	dataContainer.addEventListener('click', (e) => {
		const closest = e.target.closest('.delete-row-btn');
		if (!closest) return;

		const parent = closest.closest('div');
		dataContainer.removeChild(parent);
	});
}

function initDeleteFeature() {
	titleContainer.addEventListener('click', (e) => {
		const closest = e.target.closest('.delete-icon');
		if (!closest || titleContainer.children.length <= 3) return;

		const parent = closest.closest('.title');
		const index = Array.from(titleContainer.children).findIndex(
			(el) => el === parent
		);

		titleContainer.removeChild(parent);
		Array.from(dataContainer.children).forEach((row) => {
			row.removeChild(row.children[index]);
		});
	});
}

function initAddFeature() {
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
			const children = data.children;
			const insertAfter = children[lastFeatureIndex];
			insertAfter.insertAdjacentHTML('afterend', getInputDataComponent());
		});

		if (titleContainer.children.length > 6) {
			addNewFeatureBtn.classList.add('hide');
		} else {
			addNewFeatureBtn.classList.remove('hide');
		}
	});
}

function initAddDataset() {
	addNewDataBtn.addEventListener('click', () => {
		const featuresLength = titleContainer.children.length - 1;
		dataContainer.insertAdjacentHTML(
			'beforeend',
			getInputRowDataComponent(featuresLength)
		);
	});
}

function initOpenCloseCustomInputModal() {
	const closeModalBtn = document.getElementById('close-modal-btn');
	closeModalBtn.addEventListener('click', () => {
		modal.classList.add('hide');
		inputDimensionColumnText.textContent = titleContainer.children.length - 2;
		inputDimensionRowText.textContent = dataContainer.children.length;
	});
	const openModalBtn = document.getElementsByClassName('open-modal-btn');
	Array.from(openModalBtn).forEach((el) =>
		el.addEventListener('click', () => modal.classList.remove('hide'))
	);
}

function getTitles() {
	let titles = Array.from(titleContainer.children).map((child, idx, arr) => {
		if (child.children.length === 0) return child.textContent;
		return child.children[0].textContent;
	});
	titles.splice(titles.length - 2, 1);
	return titles;
}

function getInputData() {
	try {
		return Array.from(dataContainer.children).reduce((acc, rowDOM) => {
			let rowData = [];
			for (let i = 0; i < rowDOM.children.length - 1; i++) {
				const element = rowDOM.children[i];
				if (!element.value) throw new Error('Input is not filled!');
				rowData.push(element.value);
			}
			acc.push(rowData);
			return acc;
		}, []);
	} catch (e) {
		alert('Your input data is not fully filled!');
		return null;
	}
}

export function getDataset() {
	let titles = getTitles();
	let data = getInputData();

	return [ titles, data ];
}

export default function initInputDataListeners() {
	initAddDataset();
	initDeleteDataset();
	initAddFeature();
	initDeleteFeature();
	initOpenCloseCustomInputModal();
}
