export default function getFeatureTitleComponent (itemNumber){
  return `
    <span class="title">
        <span contenteditable="true">Feature ${itemNumber}</span>
        <span class="delete-icon pointer">&#9932;</span>
    </span>
  `;
}
