const meow = require('meow');
const meowHelp = require('cli-meow-help');

const flags = {
	name: {
		type: `string`,
		alias: `n`,
		desc: `Name of the npm package`
	},
	add: {
		type: `boolean`,
		default: true,
		alias: `d`,
		desc: `Should add package on scarf.sh`
	},
	'no-add': {
		type: `boolean`,
		default: false,
		desc: `Should not add package on scarf.sh`
	},
	dep: {
		type: `boolean`,
		default: true,
		alias: `d`,
		desc: `Should install scarf dependency`
	},
	'no-dep': {
		type: `boolean`,
		default: false,
		desc: `Should not install scarf dependency`
	},
	git: {
		type: `boolean`,
		default: true,
		alias: `g`,
		desc: `Should git commit/push`
	},
	'no-git': {
		type: `boolean`,
		default: false,
		desc: `Should not git commit/push`
	},
	release: {
		type: `boolean`,
		default: true,
		alias: `r`,
		desc: `Release a patch on npm`
	},
	'no-release': {
		type: `boolean`,
		default: false,
		desc: `Don't release a patch on npm`
	},
	public: {
		type: `boolean`,
		default: false,
		alias: `p`,
		desc: `Should npm release have --access public?`
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
