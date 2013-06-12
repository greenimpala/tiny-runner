module.exports = function (name, fn) {
	try { fn(); } catch (e) { var err = e; }
	console.log((err ? '\x1B[31m' + '✖ Failed: ' : '\x1B[32m' + '✓ Passed: ') + '\x1B[37m' + name);
	if (err) console.log('\n\u0009' + err + '\n');
};