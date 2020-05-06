class Animation {

	constructor(renderer, pathFinder) {
		this.path = [];
		this.renderer = renderer;
		this.animationFrame = null;
		this.timerId = null;
		this.previous = {};
		this.pathFinder = pathFinder;
		this.start = {
			'c': 0,
			'r': 0
		};
	}

	addEvent() {
		this.renderer.get().addEventListener('click', (e) => {
			this.animationFrame = null;
			clearInterval(this.timerId);

			let target = {
				c: this.renderer.getColFromX(e.clientX),
				r: this.renderer.getRowFromY(e.clientY)
			};

			this.renderer.clearBlocks(this.path);
			this.path = this.pathFinder.generatePath(this.start, target);

			if (!this.path) {
				return
			}

			this.renderer.drawPath(this.path);

			this.previous = {
				c: this.start.c,
				r: this.start.r
			};

			let animationCallback = () => {
				let curr = this.path.shift();

				if (!curr) {
					window.cancelAnimationFrame(this.animationFrame);
					return
				}

				this.renderer.context.clearRect(this.renderer.getXFromCol(this.previous.c) + 1, this.renderer.getYFromRow(this.previous.r) + 1, 38, 38);
				let res = curr.split(',');
				this.start = this.previous = {
					c: res[0],
					r: res[1]
				};
				this.renderer.clearBlock(this.previous.c, this.previous.r);
				this.renderer.drawPlayer(res[0], res[1]);

				if (this.path.length > 0) {
					this.timerId = setTimeout(() => {
						window.requestAnimationFrame(animationCallback);
					}, 200)
				}
			};

			this.animationFrame = window.requestAnimationFrame(animationCallback);
		});
	}
}

export {Animation}