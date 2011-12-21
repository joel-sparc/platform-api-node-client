var assert = module.exports = require('assert');

assert.jsonContentType = function(headers) {
	assert(headers['content-type'] === 'application/json; charset=utf-8');
};