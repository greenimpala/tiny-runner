var tests = [], scheduled, globalFail;

function runLoop (i, promise) {
	i = i || 0;
	if (promise) {
		promise.then(function (fn) {
			var test = tests[i - 1];
			run(test.name, fn);
			runLoop(i);
		});
	} else {
		var test = tests[i];
		if (!test) process.exit(globalFail ? 1 : 0);
		promise = run(test.name, test.fn);
		runLoop(++i, promise);
	}
}

function run (name, fn) {
	var promise;

	try {
		promise = fn();
	} catch (e) {
		var err = globalFail = e;
	}

	if (promise && !err) return promise;

	console.log((err ? '\x1B[31m' + '✖ Failed: ' : '\x1B[32m' + '✓ Passed: ') + '\x1B[37m' + name);
	if (err) console.log('\n\u0009' + err + '\n');
}

module.exports = function (name, fn) {
	tests.push({
		name: name,
		fn: fn
	});

	if (!scheduled) {
		scheduled = true;
		process.nextTick(runLoop);
	}
};
