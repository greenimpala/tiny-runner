var bind = require('bind-this');
var EventEmitter = require('events').EventEmitter;

function Runner (name, fn) {
	this.tests = [];
	this.scheduled = false;
	this.failed = false;
}

Runner.prototype = Object.create(EventEmitter.prototype);

Runner.prototype.register = function (name, fn) {
	this.tests.push({
		name: name,
		fn: fn
	});
};

Runner.prototype.runLoop = function (i, promise) {
	i = i || 0;

	if (promise) {
		promise.then(bind(this, function (fn) {
			var test = this.tests[i - 1];
			test.fn = fn || function () {};
			this._runTest(test);

			this.runLoop(i);
		}));
	} else {
		var test = this.tests[i];

		if (!test) {
			return this._end();
		}

		promise = this._runTest(test);
		this.runLoop(++i, promise);
	}
};

Runner.prototype._runTest = function (test) {
	var promise;

	try {
		promise = test.fn();
	} catch (e) {
		var err = this.failed = e;
	}

	if (promise && !err) {
		return promise;
	}

	this.emit('out', (err ? '\x1B[31m' + '✖ Failed: ' : '\x1B[32m' + '✓ Passed: ') + '\x1B[37m' + test.name);

	if (err) {
		this.emit('out', '\n\u0009' + err + '\n');
	}
};

Runner.prototype._end = function () {
	this.emit('end', this.failed, this.tests);
};

module.exports = Runner;