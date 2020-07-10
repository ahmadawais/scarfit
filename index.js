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
const readPkgUp = require('read-pkg-up');
const to = require('await-to-js').default;
const Configstore = require('configstore');
const scarfPackage = require('scarf-package');
const handleError = require('cli-handle-error');
const {green: g, yellow: y, red: r} = require('chalk');

const init = require('./utils/init');
const cli = require('./utils/cli');
const log = require('./utils/log');
const ask = require('./utils/ask');

let pkgName, err, res;
const input = cli.input;
const flags = cli.flags;
const {clear, debug, name, add, dep, git, release, public} = flags;
const spinner = ora({text: ``});

(async () => {
	init({clear});
	input.includes(`help`) && cli.showHelp(0);

	const pkg = await readPkgUp();
	const guessedName = pkg && pkg.packageJson && pkg.packageJson.name;

	const config = new Configstore(`scarfit`, {});
	const username = config.get(`username`);
	const apiToken = config.get(`apiToken`);

	if (!username) {
		const username = await ask({
			message: `Your Scarf.sh username?`,
			hint: `(Gets stored in ~/.config/scarfit/)`
		});
		config.set(`username`, username);
	}

	if (!apiToken) {
		const apiToken = await ask({
			message: `Your Scarf.sh API Token (from settings)?`,
			hint: `(Gets stored in ~/.config/scarfit/)`
		});
		config.set(`apiToken`, apiToken);
	}

	if (!name) {
		pkgName = await ask({
			message: `Name of the npm package?`,
			initial: guessedName
		});
	}

	// 1. Add package to scarf.
	if (add) {
		spinner.start(`${y`SCARF`} package adding…`);
		[err, res] = await to(
			scarfPackage({
				name: name ? name : pkgName,
				username: config.get(`username`),
				apiToken: config.get(`apiToken`)
			})
		);
		handleError(`SCARF add package`, err);
		if (res.status === 200) {
			spinner.succeed(`${g`SCARF`} package added`);
		} else {
			spinner.fail(`${r`SCARF`} package addition failed`);
		}
	}

	// 2. Add scarf dependency.
	if (dep) {
		spinner.start(`${y`SCARF`} dependency adding…`);
		[err, res] = await to(execa(`npm`, [`i`, `@scarf/scarf`]));
		handleError(`SCARF dependency`, err);
		spinner.succeed(`${g`SCARF`} dependency added`);
	}

	// 3. Git commit push.
	if (git) {
		spinner.start(`${y`GIT`} commit/push…`);
		[err, res] = await to(execa(`git`, [`add`, `.`]));
		[err, res] = await to(
			execa(`git`, [`commit`, `-m`, `📦 NEW: Analyze`])
		);
		[err, res] = await to(execa(`git`, [`push`]));
		handleError(`GIT commit/push`, err);
		spinner.succeed(`${g`GIT`} commit/push`);
	}

	// 4. Release a patch.
	if (release) {
		spinner.start(`${y`PATCH`} releasing…`);
		[err, res] = await to(
			execa(`npm`, [`version`, `patch`, `-m`, `🚀 RELEASE: Patch`])
		);

		if (public) {
			[err, res] = await to(
				execa(`npm`, [`publish`, `--access`, `public`])
			);
		} else {
			[err, res] = await to(execa(`npm`, [`publish`]));
		}

		handleError(`Patch release`, err);
		spinner.succeed(`${g`PATCH`} released`);
	}

	alert({
		type: `success`,
		name: `ALL DONE`,
		msg: ``
	});

	debug && log(flags);
})();
