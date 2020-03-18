export default function initInputTypeChangeListener() {
	const buttons = document.getElementsByClassName('change-input-type-btn');
	const container = document.getElementById('input-form-container');
	Array.from(buttons).forEach((btn) => {
		btn.addEventListener('click', () => {
			if (container.classList.contains('use-csv')) {
				container.classList.remove('use-csv');
				container.classList.add('use-custom');
			} else {
				container.classList.add('use-csv');
				container.classList.remove('use-custom');
			}
		});
	});
}
