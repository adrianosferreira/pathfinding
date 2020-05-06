import {Renderer} from "./renderer";
import {PathFinder} from "./pathfinder";
import {Animation} from "./animation";

document.addEventListener('DOMContentLoaded', () => {
	let renderer = new Renderer(1401, 641);

	renderer.drawGrid();
	renderer.drawPlayer(0, 0);
	renderer.drawTrees();

	let animation = new Animation(renderer, new PathFinder(renderer));
	animation.addEvent();
});