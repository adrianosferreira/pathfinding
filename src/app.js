import {Renderer} from "./renderer";
import {PathFinder} from "./pathfinder";
import {Animation} from "./animation";

document.addEventListener('DOMContentLoaded', () => {
	let renderer = new Renderer(1401, 641);

	renderer.drawGrid();
	renderer.drawPlayer(renderer.start.c, renderer.start.r);
	renderer.drawTrees(100);

	let animation = new Animation(renderer, new PathFinder(renderer));
	animation.addEvent();
});