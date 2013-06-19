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

Test files should register tests in the following format.

```js
var test = require('tiny-runner');

test('can add two numbers', function () {
	var val = add(1, 1);
	assert.equal(2, val)
});
```

For async tests return a Promise/A compatible promise and resolve it with an assertion callback.

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