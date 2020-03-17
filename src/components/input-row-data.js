import getInputDataComponent from './input-data';

export default function getInputRowDataComponent (length){
  let component = '<div>';

  Array.from({ length }).forEach(() => {
    component += getInputDataComponent();
  });

  component += `
			<span
				class="delete-row-btn"
			>&#9932;</span>
		</div>
	`;
  return component;
}
