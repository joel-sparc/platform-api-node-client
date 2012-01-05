var assert = module.exports = require('assert');

assert.jsonContentType = function(headers) {
	assert(headers['content-type']);
	assert(headers['content-type'].indexOf('application/json') !== -1);
};