export default function getFeatureTitleComponent(itemNumber) {
	return `
    <span>
        Feature ${itemNumber}
        <span class="delete-icon pointer" data-index="${itemNumber}">&#9932;</span>
    </span>
  `;
}
