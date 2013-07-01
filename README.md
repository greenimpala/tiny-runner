# tiny-runner

A tiny test runner with async support.

![drawing](https://raw.github.com/st3redstripe/tiny-runner/assets/screen.png)

## Installation

```bash
$ npm install tiny-runner
```

## Usage

```bash
$ node <filename>
```

Test files should register tests to the register function by passing a name and test callback. The runner will execute registered tests on the next tick of the event loop. You may use any standard assertion library.

```js
var test = require('tiny-runner');

test('can add two numbers', function () {
	var val = add(1, 1);
	assert.equal(2, val)
});
```

For deferred tests return a Promise/A compatible object. Your test should resolve the promise when done. You may also pass a callback when resolving the promise if you need to make any post-async assertions.

```js
test('can add two numbers via server', function () {
	var def = new Deferred();

	serverAdd(1, 1).then(function (val) {
		def.resolve(function () {
			assert.equal(2, val);	
		});
	});

	return def.promise;
});
```

## Before / After

Use `test.beforeEach(fn)` and `test.afterEach(fn)` to schedule setup and teardown decorators. The methods will be ran until another is assigned - you may pass `null` to clear an existing decorator.

## Options

Pass a timeout argument to override the default test timeout.

```bash
$ node tests 1000
```

## Tests

Test runners need tests too.

```bash
npm test
```