var assert = require('./helpers/assert'),
	Client = require('../');

// create our Client instance to use for testing
var client = new Client({
	host: 'localhost',
	port: 3210,
	tenant: 'sparc'
});

describe('/users', function() {
	describe('GET:', function() {
		// variables that span test cases
		var resp, body;

		it('should complete without any errors', function(done) {
			client.users.get(function(err, r, b) {
				assert.ifError(err);
				resp = r;
				body = b;
				done()
			});
		});

		it('should return a valid JSON content type', function() {
			assert.jsonContentType(resp.headers);
		});

	});
});

