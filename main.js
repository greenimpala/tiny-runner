var bind = require('bind-this');
var Runner = require('./Runner');

var runner = new Runner();
var scheduled;

runner.on('end', function (failed, tests) {
	process.exit(failed ? 1 : 0);
});

runner.on('out', console.log);

module.exports = function () {
	runner.register.apply(runner, arguments);

	if (!scheduled) {
		scheduled = true;
		process.nextTick(bind(runner, 'runLoop'));
	}
};