let gridOptions = {
	color:     'grey',
	gridSize:  40,
	linesSize: 0
};

let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");
let height = canvas.height;
let width = canvas.width;

export {height, width, ctx, gridOptions, canvas}