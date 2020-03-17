const modal = document.getElementById('custom-input-modal');
const closeModal = () => modal.classList.add('hide');
const openModal = () => modal.classList.remove('hide');

export default function initModalControl() {
	const closeModalBtn = document.getElementById('close-modal-btn');
	closeModalBtn.addEventListener('click', closeModal);
	const openModalBtn = document.getElementById('open-modal-btn');
	openModalBtn.addEventListener('click', openModal);
}
