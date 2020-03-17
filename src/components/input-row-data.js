import getInputDataComponent from './input-data';

export default function getInputRowDataComponent(length, currentIndex) {
	let component = '<div>';
	Array.from({ length }).forEach(() => {
		component += getInputDataComponent();
	});
	component += `
		<span
			class="delete-row-btn"
			data-index="${currentIndex}"
		>&#9932;</span></div>`;
	return component;
}
