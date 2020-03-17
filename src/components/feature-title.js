export default function getFeatureTitleComponent (itemNumber){
  return `
    <span class="title">
        Feature ${itemNumber}
        <span class="delete-icon pointer">&#9932;</span>
    </span>
  `;
}
