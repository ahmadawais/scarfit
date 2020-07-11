const welcome = require('cli-welcome');
const pkg = require('./../package.json');
const unhandled = require('cli-handle-unhandled');

module.exports = ({clear = true}) => {
	unhandled();
	welcome({
		title: `scarfit`,
		tagLine: `by Awais.dev`,
		description: pkg.description,
		version: pkg.version,
		bgColor: '#0cbccd',
		color: '#000000',
		bold: true,
		clear
	});
};
