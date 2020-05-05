const path = require('path');

module.exports = {
	entry: './src/app.js',
	devtool: 'source-map',
	output: {
		path: path.resolve(__dirname, 'dist'),
		filename: 'bundle.js'
	}
};