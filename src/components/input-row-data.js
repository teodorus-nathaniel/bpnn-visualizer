import getInputDataComponent from './input-data';

export default function getInputRowDataComponent(length) {
	let component = '<div>';
	Array.from({ length }).forEach(() => {
		component += getInputDataComponent();
	});
	component += '</div>';
	return component;
}
