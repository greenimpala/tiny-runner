# tiny-runner

A thirty line Node.js test runner with support for async tests.

## Sample output

<img src="https://raw.github.com/st3redstripe/tiny-runner/assets/screen.png" style="height: 10px;"/>

## Usage

```js
var test = require('tiny-runner');
var assert = require('assert');

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

## Run

```js
$ node tests.js
```
