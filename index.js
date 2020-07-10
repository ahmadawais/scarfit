#!/usr/bin/env node

/**
 * scarfit
 * Add scarf analytics to a Node pkg, git commit/push, and release an npm patch
 *
 * @author Ahmad Awais <https://twitter.com/MrAhmadAwais/>
 */

const init = require('./utils/init');
const cli = require('./utils/cli');
const log = require('./utils/log');

const input = cli.input;
const flags = cli.flags;
const { clear, debug } = flags;

(async () => {
	init({ clear });
	input.include(`help`) && cli.showHelp(0);

	debug && log(flags);
})();
