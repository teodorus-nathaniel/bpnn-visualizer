export function getNextDimension(arr, col) {
	return arr.map((val) => val[col]);
}

export function getDataExceptColumn(arr, col) {
	return arr.map((val) => {
		val.splice(col, 1);
		return val;
	});
}

export function forEachElement(components, fn) {
	if (components instanceof Array) {
		components.forEach((component) => forEachElement(component, fn));
		return;
	}
	if (!components) return;
	fn(components);
}
