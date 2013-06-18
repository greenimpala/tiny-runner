var bind = require('bind-this');

function Runner (name, fn) {
	this.tests = [];
	this.scheduled = false;
	this.failed = false;
}

Runner.prototype.register = function (name, fn) {
	this.tests.push({
		name: name,
		fn: fn
	});
};

Runner.prototype.getTests = function () {
	return this.tests;
};

Runner.prototype.runLoop = function (i, promise) {
	i = i || 0;

	if (promise) {
		promise.then(bind(this, function (fn) {
			var test = this.tests[i - 1];
			this.runTest(test.name, fn);
			this.runLoop(i);
		}));
	} else {
		var test = this.tests[i];

		if (!test) {
			this.end();
		}

		promise = this.runTest(test.name, test.fn);
		this.runLoop(++i, promise);
	}
};

Runner.prototype.runTest = function (name, fn) {
	var promise;

	try {
		promise = fn();
	} catch (e) {
		var err = this.failed = e;
	}

	if (promise && !err) {
		return promise;
	}

	console.log((err ? '\x1B[31m' + '✖ Failed: ' : '\x1B[32m' + '✓ Passed: ') + '\x1B[37m' + name);

	if (err) {
		console.log('\n\u0009' + err + '\n');
	}
};

Runner.prototype.end = function () {
	process.exit(this.failed ? 1 : 0);
};

module.exports = Runner;