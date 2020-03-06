export default function stageComponents(stage, components) {
	if (components instanceof Array) {
		components.forEach((component) => stageComponents(stage, component));
		return;
	}
	if (!components) return;
	stage.addChild(components);
}
