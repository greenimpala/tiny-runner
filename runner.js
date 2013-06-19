var bind = require('bind-this');
var EventEmitter = require('events').EventEmitter;

function Runner (params) {
	params = params || {};

	this.timeoutLength = params.timeoutLength || 3000;
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

Runner.prototype.run = function () {
	this._runLoop(0);
};

Runner.prototype._runLoop = function (i, promise) {
	var test;

	if (promise) {
		test = this.tests[i - 1];
		var testTimedOut = false;

		var timeout = setTimeout(bind(this, function () {
			testTimedOut = true;
			this._failTest(test);
			this._runLoop(i);
		}), this.timeoutLength);


		promise.then(bind(this, function (fn) {
			clearTimeout(timeout);

			if (!testTimedOut) {
				test.fn = fn || function () {};
				this._runTest(test);
				this._runLoop(i);
			}
		}));
	} else {
		test = this.tests[i];

		if (!test) {
			return this._end();
		}

		promise = this._runTest(test);
		this._runLoop(++i, promise);
	}
};

Runner.prototype._runTest = function (test) {
	var promise;

	try {
		promise = test.fn();
	} catch (e) {
		var err = e;
	}

	if (promise && !err) {
		return promise;
	}

	if (err) {
		this._failTest(test);
	} else {
		this._passTest(test);
	}
};

Runner.prototype._passTest = function (test) {
	this.emit('out', '\x1B[32m' + '✓ Passed: ' + '\x1B[37m' + test.name);
};

Runner.prototype._failTest = function (test, err) {
	this.failed = true;
	this.emit('out', '\x1B[31m' + '✖ Failed: ' + '\x1B[37m' + test.name);
	this.emit('out', '\n\u0009' + err + '\n');
};

Runner.prototype._end = function () {
	this.emit('end', this.failed, this.tests);
};

module.exports = Runner;