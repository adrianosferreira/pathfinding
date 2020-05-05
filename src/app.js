import * as Renderer from './renderer';

let gridOptions = {
	color:     'grey',
	gridSize:  40,
	linesSize: 0
};

let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");
let height = canvas.height;
let width = canvas.width;

function getRandomCol() {
	return Math.floor(Math.random() * (width / gridOptions.gridSize))
}

function getCol(x) {
	return Math.floor( x / gridOptions.gridSize );
}

function getRow(y) {
	return Math.floor( y / gridOptions.gridSize );
}

function getRandomRow() {
	return Math.floor(Math.random() * (height / gridOptions.gridSize))
}

function getX(c) {
	return c % Math.floor((width / gridOptions.gridSize)) * gridOptions.gridSize
}

function getY(r) {
	return r % Math.floor((width / gridOptions.gridSize)) * gridOptions.gridSize
}

let personPos = {
	'c': 0,
	'r': 0,
};

let filledTiles = [
	{
		pos:  `${personPos.c},${personPos.r}`,
		type: 'person'
	}
];

let targetPos = {};

while (undefined == targetPos.x) {
	let c = getRandomCol();
	let r = getRandomRow();

	if (filledTiles.filter(el => el.pos == `${c},${r}`).length == 0) {
		targetPos.c = c
		targetPos.r = r
	}

	break
}

function displayGrid() {
	ctx.strokeStyle = gridOptions.color;
	ctx.lineWidth = parseInt(gridOptions.linesSize);
	let GridSize = parseInt(gridOptions.gridSize);
	for (let i = 0; i < height; i += GridSize) {
		ctx.moveTo(0, i);
		ctx.lineTo(width, i);
		ctx.stroke();
	}
	for (let i = 0; i < width; i += GridSize) {
		ctx.moveTo(i, 0);
		ctx.lineTo(i, height);
		ctx.stroke();
	}
}

function drawPerson(c, r) {
	ctx.drawImage(document.getElementById('person'), getX(c), getY(r), 40, 40)
}

function drawPath(c, r) {
	ctx.beginPath();
	ctx.arc(getX(c)+20, getY(r)+20, 5, 0, 2 * Math.PI);
	ctx.fillStyle = 'red';
	ctx.fill();
	ctx.lineWidth = 0;
	ctx.stroke();
}

function drawTrees() {
	for (let i = 0; i < 150; i++) {
		let c = getRandomCol();
		let r = getRandomRow();

		if (filledTiles.filter(el => el.pos == `${c},${r}`).length > 0) {
			i -= 1
			continue
		}

		ctx.drawImage(document.getElementById('tree'), getX(c) + 1, getY(r) + 1, 38, 38)

		filledTiles.push({
							 pos:  `${c},${r}`,
							 type: 'tree'
						 })
	}
}

function drawTarget() {
	ctx.drawImage(document.getElementById('house'), getX(targetPos.c), getY(targetPos.r), 40, 40)

	filledTiles.push({
						 pos:  `${targetPos.c},${targetPos.r}`,
						 type: 'target'
					 })
}

document.addEventListener('DOMContentLoaded', () => {
	displayGrid();
	drawPerson(personPos.c, personPos.r);
	drawTrees();
});

let path = [];
let start = personPos;
let animationFrame = null;
let timerId = null

let old = {};

canvas.addEventListener( 'click', (e) => {
	window.cancelAnimationFrame(animationFrame);
	animationFrame = null;
	clearInterval(timerId);

	let target = { c: getCol(e.clientX), r: getRow(e.clientY) };

	for(let i = 0; i < path.length; i ++) {
		let res = path[i].split(',');
		ctx.clearRect(getX(res[0]) + 1, getY(res[1]) + 1, 38, 38);
	}

	path = generatePath(start, target);

	for(let i = 0; i < path.length; i ++) {
		let res = path[i].split(',');
		drawPath(res[0], res[1]);
	}

	if(!path) {
		return
	}

	old = {
		c: start.c,
		r: start.r
	};

	animationFrame = window.requestAnimationFrame(animatePath);
});

function animatePath() {
	let curr = path.shift();

	if(!curr){
		window.cancelAnimationFrame(animationFrame);
		return
	}

	ctx.clearRect(getX(old.c) + 1, getY(old.r) + 1, 38, 38);
	let res = curr.split(',');
	start = {c: res[0], r: res[1]};
	old = {
		c: res[0],
		r: res[1]
	};
	ctx.clearRect(getX(old.c) + 1, getY(old.r) + 1, 38, 38);
	drawPerson(res[0], res[1]);

	if (path.length > 0) {
		timerId = setTimeout(() => {
			window.requestAnimationFrame(animatePath);
		}, 200)
	}
}

function generatePath(source, target) {
	let c = {
		c: source.c,
		r: source.r
	};

	let q = [c];
	let found = false;
	let visited = [];
	let paths = {};
	paths[`${c.c},${c.r}`] = false;

	while (q.length > 0) {
		let old = c;
		c = q.shift();
		let dr = [-1, 1, 0, 0];
		let dc = [0, 0, -1, 1];

		if (target.c == c.c && target.r == c.r) {
			found = true;
			break
		}

		for (let i = 0; i < dr.length; i++) {
			let cr = parseInt(c.r) + dr[i];
			let cc = parseInt(c.c) + dc[i];

			if (cr < 0 || cc < 0 || cr > Math.floor(height / gridOptions.gridSize) - 1 || cc > Math.floor(width / gridOptions.gridSize) - 1) {
				continue
			}

			if (visited.indexOf(`${cc},${cr}`) !== -1) {
				continue
			}

			let notEmptyArea = filledTiles.filter(el => el.pos == `${cc},${cr}`);

			if (notEmptyArea.length > 0 && notEmptyArea[0].type == 'tree') {
				continue
			}

			visited.push(`${cc},${cr}`);
			q.push({
					   c: cc,
					   r: cr
				   });
			paths[`${cc},${cr}`] = `${c.c},${c.r}`
		}
	}

	if (found) {
		let rightPath = [`${target.c},${target.r}`];

		c = paths[`${target.c},${target.r}`];

		if(!c) {
			return false
		}

		while (c !== `${source.c},${source.r}`) {
			rightPath.push(c);
			c = paths[c]
		}

		return rightPath.reverse()
	} else {
		return false
	}
}