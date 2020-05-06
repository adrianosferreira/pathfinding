class Renderer {

	constructor(width, height) {
		this.width = width;
		this.height = height;
		this.canvas = document.createElement('canvas');
		this.canvas.setAttribute('width', width);
		this.canvas.setAttribute('height', height);
		this.context = this.canvas.getContext("2d");
		this.gridOptions = {
			color:     'grey',
			gridSize:  40,
			linesSize: 0
		};
		this.occupied = {};

		document.getElementsByTagName('body')[0].appendChild(this.canvas);
	}

	get() {
		return this.canvas;
	}

	getRandomCol() {
		return Math.floor(Math.random() * (this.width / this.gridOptions.gridSize))
	}

	getColFromX(x) {
		return Math.floor(x / this.gridOptions.gridSize);
	}

	getRowFromY(y) {
		return Math.floor(y / this.gridOptions.gridSize);
	}

	getRandomRow() {
		return Math.floor(Math.random() * (this.height / this.gridOptions.gridSize))
	}

	getXFromCol(c) {
		return c % Math.floor((this.width / this.gridOptions.gridSize)) * this.gridOptions.gridSize
	}

	getYFromRow(r) {
		return r % Math.floor((this.width / this.gridOptions.gridSize)) * this.gridOptions.gridSize
	}

	drawGrid() {
		this.context.strokeStyle = this.gridOptions.color;
		this.context.lineWidth = parseInt(this.gridOptions.linesSize);
		let gridSize = parseInt(this.gridOptions.gridSize);
		for (let i = 0; i < this.height; i += gridSize) {
			this.context.moveTo(0, i);
			this.context.lineTo(this.width, i);
			this.context.stroke();
		}
		for (let i = 0; i < this.width; i += gridSize) {
			this.context.moveTo(i, 0);
			this.context.lineTo(i, this.height);
			this.context.stroke();
		}
	}

	drawPlayer(c, r) {
		let image = document.createElement('img');
		image.setAttribute('src', 'img/person.png');
		image.setAttribute('id', 'person');

		image.onload = () => {
			this.context.drawImage(image, this.getXFromCol(c), this.getYFromRow(r), this.gridOptions.gridSize, this.gridOptions.gridSize);
		};

		this.occupied[this.getKey(c, r)] = 'player';
	}

	drawPath(path) {
		for(let i = 0; i < path.length; i ++) {
			let c, r;

			[c, r] = path[i].split(',');
			this.context.beginPath();
			this.context.arc(this.getXFromCol(c)+20, this.getYFromRow(r)+20, 5, 0, 2 * Math.PI);
			this.context.fillStyle = 'red';
			this.context.fill();
			this.context.lineWidth = 0;
			this.context.stroke();
		}
	}

	getKey(c, r) {
		return `${c},${r}`;
	}

	isOccupiedByTree(c, r) {
		return undefined !== this.occupied[this.getKey(c, r)] && this.occupied[this.getKey(c, r)] === 'tree';
	}

	drawTrees() {
		for (let i = 0; i < 150; i++) {
			let c = this.getRandomCol();
			let r = this.getRandomRow();

			if (undefined !== this.occupied[this.getKey(c, r)]) {
				i -= 1;
				continue
			}

			let image = document.createElement('img');
			image.setAttribute('src', 'img/tree.jpeg');
			image.setAttribute('id', 'tree');

			image.onload = () => {
				this.context.drawImage(image, this.getXFromCol(c) + 1, this.getYFromRow(r) + 1, this.gridOptions.gridSize - 1, this.gridOptions.gridSize - 1);
			};

			this.occupied[this.getKey(c, r)] = 'tree';
		}
	}

	clearBlock(c, r) {
		this.context.clearRect(this.getXFromCol(c) + 1, this.getYFromRow(r) + 1, this.gridOptions.gridSize - 2, this.gridOptions.gridSize - 2);
	}

	clearBlocks(path) {
		for (let i = 0; i < path.length; i++) {
			let res = path[i].split(',');
			this.clearBlock(res[0], res[1]);
		}
	}
}

export {Renderer}