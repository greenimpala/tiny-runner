var bind = require('bind-this');
var Runner = require('./lib/Runner');

var runner = new Runner({
	"timeoutLength": process.argv[2]
});
var scheduled;

process.stdin.resume();

runner.on('end', function (failed, tests) {
	process.exit(failed ? 1 : 0);
});

runner.on('out', console.log);

module.exports = function () {
	runner.register.apply(runner, arguments);

	if (!scheduled) {
		scheduled = true;
		process.nextTick(bind(runner, 'run'));
	}
};