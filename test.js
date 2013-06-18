var test = require('./runner');
var assert = require('assert');

test('can pass tests', function () {
	assert(true);
});

test('can fail tests', function () {
	assert(false);
});

test('blocks run loop when returning promises', function () {
	var promise = {
		then: function (fn) {
			// Fake resolve and fail test
			process.nextTick(function () {
				fn(function () {
					assert(true);
				});
			});
		}
	};

	return promise;
});

test('can pass test with promise API', function () {
	var promise = {
		then: function (fn) {
			// Fake resolve and pass test
			fn(function () {
				assert(true);
			});
		}
	};

	return promise;
});

test('can fail test with promise API', function () {
	var promise = {
		then: function (fn) {
			// Fake resolve and fail test
			fn(function () {
				assert(false);
			});
		}
	};

	return promise;
});