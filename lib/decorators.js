module.exports = {
	register: function (name, fn) {
		this.tests.push({
			name: name,
			fn: fn
		});
	},

	beforeEach: function (fn) {
		this.beforeEach = fn;
	},

	afterEach: function (fn) {
		this.afterEach = fn;
	}
};