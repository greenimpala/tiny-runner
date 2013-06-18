var test = require('./main');
var assert = require('assert');
var Runner = require('./Runner');

test('can register tests', function () {
	var runner = new Runner();

	assert.equal(0, runner.getTests().length);
	runner.register("test", function () {});
	assert.equal(1, runner.getTests().length);
});

test('can pass tests', function () {
	
});

// test('can fail tests', function () {
// 	assert(false);
// });

// test('blocks run loop when returning promises', function () {
// 	var promise = {
// 		then: function (fn) {
// 			// Fake resolve and fail test
// 			process.nextTick(function () {
// 				fn(function () {
// 					assert(true);
// 				});
// 			});
// 		}
// 	};

// 	return promise;
// });

// test('can pass test with promise API', function () {
// 	var promise = {
// 		then: function (fn) {
// 			// Fake resolve and pass test
// 			fn(function () {
// 				assert(true);
// 			});
// 		}
// 	};

// 	return promise;
// });

// test('can fail test with promise API', function () {
// 	var promise = {
// 		then: function (fn) {
// 			// Fake resolve and fail test
// 			fn(function () {
// 				assert(false);
// 			});
// 		}
// 	};

// 	return promise;
// });