var assert = require('./helpers/assert'),
	Client = require('../');

// create our Client instance to use for testing
var client = new Client({
	host: 'localhost',
	port: 3210,
	tenant: 'test'
});

describe('/events', function() {

	// ask the server to initialize the test database before starting
	before(function(done) {
		// not using the client library for this request because it automatically
		// attaches the tenant slug, which doesn't exist yet
		var opts = {
			host: client.host,
			port: client.port,
			method: 'DELETE',
			path: '/db'
		};
		var req = require('http').request(opts, function(res) {
			res.on('end', function() {
				if(res.statusCode !== 200) {
					done(new Error('Failed to initialize database. Response Status: ' + res.statusCode));
				}
				done();
			});
		});
		req.on('error', done);
		req.end();
	});

	describe('POST:', function() {
		var resp, body;

		it('should complete without any errors', function(done) {
			client.events.post({
				timestamp: Date.now(),
				category: 'api-test',
				data: {
					iminurlogz: 'stealin ur eventz'
				},
				deltas: {
					lolcats: 1
				}
			}, function(err, r, b) {
				assert.ifError(err);
				resp = r;
				body = b;
				done();
			});
		});

		it('should return a valid JSON content type', function() {
			assert.jsonContentType(resp.headers);
		});

		it('should respond with a 201 status code', function() {
			assert.strictEqual(resp.statusCode, 201);
		});
	});

});