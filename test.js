var tinyrunner = require('./main');
var assert = require('assert');
var Q = require('Q');
var Runner = require('./lib/Runner');

it('can register tests', function () {
	var runner = new Runner();

	runner.register("test 1", function () {});
	runner.register("test 2", function () {});
});

it('emits end event when tests complete', function () {
	var def = Q.defer();
	var runner = new Runner();

	runner.on('end', def.resolve);
	runner.run();

	return def.promise;
});

it('can pass tests', function () {
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

it('can fail tests', function () {
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

it('blocks runner until async test is resolved', function () {
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

it('executes assertions if async test resolved with a failing function', function () {
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

it('executes assertions if async test resolved with a succesful function', function () {
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

it('fails test if promise does not resolve timely', function () {
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

it('can run beforeEach and afterEach function for sync test', function () {
	var runner = new Runner();
	var stack = [];
	var def = Q.defer();

	runner.on('end', function (failed) {
		def.resolve(function () {
			assert(!failed);
			assert.equal(3, stack.length);
			assert.equal('foo', stack[0]);
			assert.equal('bar', stack[1]);
			assert.equal('baz', stack[2]);
		});
	});

	runner.beforeEach(function () {
		stack.push('foo');
	});

	runner.afterEach(function () {
		stack.push('baz');
	});

	runner.register('test', function () {
		stack.push('bar');
	});
	runner.run();

	return def.promise;
});

it('can run beforeEach and afterEach function for async test', function () {
	var runner = new Runner();
	var stack = [];
	var def = Q.defer();
	var testDef = Q.defer();

	runner.on('end', function (failed) {
		def.resolve(function () {
			assert(!failed);
			assert.equal(3, stack.length);
			assert.equal('foo', stack[0]);
			assert.equal('bar', stack[1]);
			assert.equal('baz', stack[2]);
		});
	});

	runner.beforeEach(function () {
		stack.push('foo');
	});

	runner.afterEach(function () {
		stack.push('baz');
	});

	runner.register('test', function () {
		stack.push('bar');
		return testDef.promise;
	});

	runner.run();
	testDef.resolve();

	return def.promise;
});