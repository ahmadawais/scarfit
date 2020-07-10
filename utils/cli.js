const meow = require('meow');
const meowHelp = require('cli-meow-help');

const flags = {
	name: {
		type: `string`,
		alias: `n`,
		desc: `Name of the npm package`
	},
	clear: {
		type: `boolean`,
		default: true,
		alias: `c`,
		desc: `Clear the console`
	},
	debug: {
		type: `boolean`,
		default: false,
		alias: `d`,
		desc: `Print debug info`
	},
	version: {
		type: `boolean`,
		alias: `v`,
		desc: `Print CLI version`
	}
};

const commands = {
	help: {description: `Print help info`}
};

const helpText = meowHelp({
	name: `scarfit`,
	flags,
	commands
});

const options = {
	inferType: true,
	description: false,
	hardRejection: false,
	flags
};

module.exports = meow(helpText, options);
