# tiny-runner

A tiny test runner with async support.

`$ npm install tiny-runner`

![drawing](https://raw.github.com/st3redstripe/tiny-runner/assets/screen.png)

## Usage

```js
$ node <filename.js>
```

Where `filename.js` registers tests in the following format:

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
