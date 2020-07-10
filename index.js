#!/usr/bin/env node

/**
 * scarfit
 * Add scarf analytics to a Node pkg, git commit/push, and release an npm patch
 *
 * @author Ahmad Awais <https://twitter.com/MrAhmadAwais/>
 */
const ora = require('ora');
const execa = require('execa');
const alert = require('cli-alerts');
const to = require('await-to-js').default;
const scarfPackage = require('scarf-package');
const handleError = require('cli-handle-error');
const {green: g, yellow: y, red: r} = require('chalk');

const init = require('./utils/init');
const cli = require('./utils/cli');
const log = require('./utils/log');
const ask = require('./utils/ask');

let pkgName;
const input = cli.input;
const flags = cli.flags;
const {clear, debug, name} = flags;
const spinner = ora({text: ``});

(async () => {
	init({clear});
	input.includes(`help`) && cli.showHelp(0);

	if (!name) {
		pkgName = await ask({
			message: `Name of the npm package?`
		});
	}

	// 1. Add package to scarf.
	spinner.start(`${y`SCARF`} package adding…`);
	const [err, res] = await to(scarfPackage({name: name ? name : pkgName}));
	handleError(`SCARF add package`, err);
	if (res.status === 200) {
		spinner.succeed(`${g`SCARF`} package added`);
	} else {
		console.log(`${r`SCARF`} package addition failed`);
	}

	// 2. Add scarf dependency.
	spinner.start(`${y`SCARF`} dependency adding…`);
	const [err, res] = await to(execa(`npm`, [`i`, `@scarf/scarf`]));
	handleError(`SCARF dependency`, err);
	spinner.succeed(`${g`SCARF`} dependency added`);

	// 3. Git commit push.
	spinner.start(`${y`GIT`} commit/push…`);
	const [err, res] = await to(execa(`git`, [`add`, `.`]));
	const [err, res] = await to(
		execa(`git`, [`commit`, `-m="📦 NEW: Analyze"`])
	);
	const [err, res] = await to(execa(`git`, [`push`]));
	handleError(`GIT commit/push`, err);
	spinner.succeed(`${g`GIT`} commit/push`);

	// 4. Release a patch.
	spinner.start(`${y`PATCH`} releasing…`);
	const [err, res] = await to(
		execa(`npm`, [`version`, `patch`, `-m="🚀 RELEASE: patch"`])
	);
	const [err, res] = await to(execa(`npm`, [`publish`]));
	handleError(`Patch release`, err);
	spinner.start(`${y`PATCH`} released`);

	alert({
		type: `success`,
		name: `ALL DONE`,
		msg: ``
	});

	debug && log(flags);
})();
