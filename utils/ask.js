const fs = require('fs');
const path = require('path');
const {Input} = require('enquirer');
const to = require('await-to-js').default;
const handleError = require('cli-handle-error');
const shouldCancel = require('cli-should-cancel');

module.exports = async ({name, message, hint, initial}) => {
	const [err, response] = await to(
		new Input({
			name,
			message,
			hint,
			initial,
			validate(value) {
				return !value ? `Please add a value.` : true;
			}
		})
			.on(`cancel`, () => shouldCancel())
			.run()
	);
	handleError(`INPUT`, err);

	return response;
};
