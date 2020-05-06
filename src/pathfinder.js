class PathFinder {

	constructor( renderer ) {
		this.renderer = renderer
	}

	generatePath(source, target) {
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

				if (cr < 0 || cc < 0 || cr > Math.floor(this.renderer.height / this.renderer.gridOptions.gridSize) - 1 || cc > Math.floor(this.renderer.width / this.renderer.gridOptions.gridSize) - 1) {
					continue
				}

				if (visited.indexOf(`${cc},${cr}`) !== -1) {
					continue
				}

				if (this.renderer.isOccupiedByTree(cc, cr)) {
					continue
				}

				visited.push(`${cc},${cr}`);
				q.push({c: cc, r: cr});
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
}

export {PathFinder}