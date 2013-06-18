var bind = require('bind-this');
var Runner = require('./Runner');
var runner = new Runner();
var scheduled;

module.exports = function () {
	runner.register.apply(runner, arguments);

	if (!scheduled) {
		scheduled = true;
		process.nextTick(bind(runner, 'runLoop'));
	}
};