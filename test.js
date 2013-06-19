var assert = require('assert');
var Q = require('Q');
var test = require('./main');
var Runner = require('./Runner');

test('can register tests', function () {
	var runner = new Runner();

	runner.register("test 1", function () {});
	runner.register("test 2", function () {});
});

test('emits end event when tests complete', function () {
	var def = Q.defer();
	var runner = new Runner();

	runner.on('end', def.resolve);
	runner.run();

	return def.promise;
});

test('can pass tests', function () {
	var def = Q.defer();
	var runner = new Runner();

	runner.on('end', function (failed, tests) {
		def.resolve(function () {
			assert(!failed);
			assert.equal("test", tests[0].name);
		});
	});

	runner.register("test", function () {});
	runner.run();

	return def.promise;
});

test('can fail tests', function () {
	var def = Q.defer();
	var runner = new Runner();

	runner.on('end', function (failed, tests) {
		def.resolve(function () {
			assert(failed);
			assert.equal("test", tests[0].name);
		});
	});

	runner.register("test", function () {
		throw new Error();
	});
	runner.run();

	return def.promise;
});

test('blocks runner until async test is resolved', function () {
	var def = Q.defer();
	var testDef = Q.defer();
	var runner = new Runner();

	runner.register("test", function () {
		return testDef.promise;
	});
	runner.run();

	runner.on('end', function (failed) {
		def.resolve(function () {
			assert(!failed);
		});
	});

	testDef.resolve();
	return def.promise;
});

test('executes assertions if async test resolved with a failing function', function () {
	var def = Q.defer();
	var testDef = Q.defer();
	var runner = new Runner();

	runner.on('end', function (failed) {
		def.resolve(function () {
			assert(failed);
		});
	});

	runner.register("test", function () {
		return testDef.promise;
	});
	runner.run();

	testDef.resolve(function () {
		throw new Error();
	});

	return def.promise;
});

test('executes assertions if async test resolved with a succesful function', function () {
	var def = Q.defer();
	var testDef = Q.defer();
	var runner = new Runner();

	runner.on('end', function (failed) {
		def.resolve(function () {
			assert(!failed);
		});
	});

	runner.register("test", function () {
		return testDef.promise;
	});
	runner.run();

	testDef.resolve(function () {

	});

	return def.promise;
});

test('fails test if promise does not resolve timely', function () {
	var def = Q.defer();

	var runner = new Runner({
		timeoutLength: 10
	});

	runner.on('end', function (failed) {
		def.resolve(function () {
			assert(failed);
		});
	});

	runner.register("test", function () {
		return Q.defer().promise;
	});

	runner.run();

	return def.promise;
});