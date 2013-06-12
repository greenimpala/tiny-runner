# tiny-runner

A three line Node.js test runner.

## Usage

```js
var test = require('tiny-runner');
var assert = require('assert');

test('can add two numbers', function () {
	var result = 1 + 1;
	assert.equal(2, result)
});
```

## Run

```js
$ node tests.js
```