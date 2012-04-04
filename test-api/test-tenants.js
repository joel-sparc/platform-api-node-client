var assert = require('./helpers/assert'),
	Client = require('../');

// create our Client instance to use for testing
var client = new Client({
	host: 'localhost',
	port: 3210,
	domain: 'test',
	key: require('fs').readFileSync(__dirname + '/rsa_private.pem')
});

// for various test cases
var scotlandyard = {
	name: 'Scotland Yard',
	slug: 'scotlandyard'
},
// set later on
scotlandyardId;

describe('/tenants', function() {

	// ask the server to initialize the test database before starting
	before(function(done) {
		var opts = {
			host: 'localhost',
			port: 3210,
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
			client.tenants.post(scotlandyard, function(err, r, b) {
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

		it('should return a data property with _id and uri set', function() {
			assert(body.data);
			assert(body.data._id);
			assert(body.data.uri);

			// store the _id for later use
			scotlandyardId = body.data._id;
		});

		it('should have a location header with same value as uri', function() {
			assert.strictEqual(resp.headers.location, body.data.uri);
		});

	});

	describe('GET:', function() {
		// variables that span test cases
		var resp, body;

		it('should complete without any errors', function(done) {
			client.tenants.get(function(err, r, b) {
				assert.ifError(err);
				resp = r;
				body = b;
				done();
			});
		});

		it('should return a valid JSON content type', function() {
			assert.jsonContentType(resp.headers);
		});

		it('should respond with a 200 status code', function() {
			assert.strictEqual(resp.statusCode, 200);
		});

		it('should return a data property with an array value', function() {
			assert(Array.isArray(body.data));
		});

		// note: the database initialization script invoked at the start of this script
		// automatically creates a `test` tenant record, so this test assumes that the
		// `scotlandyard` tenant is the second record returned
		it('should return the posted tenant in the second value of the data array', function() {
			assert.strictEqual(body.data.length, 2);
			assert.strictEqual(body.data[1].name, scotlandyard.name);
		});

	});

});

describe('/tenants/:id', function() {
	describe('GET:', function() {
		// variables that span test cases
		var resp, body;

		it('should complete without any errors', function(done) {
			client.tenants.id(scotlandyardId).get(function(err, r, b) {
				assert.ifError(err);
				resp = r;
				body = b;
				done();
			});
		});

		it('should return a valid JSON content type', function() {
			assert.jsonContentType(resp.headers);
		});

		it('should respond with a 200 status code', function() {
			assert.strictEqual(resp.statusCode, 200);
		});

		it('should return the posted tenant in the data value', function() {
			assert.strictEqual(body.data.name, scotlandyard.name);
		});

	});

	describe('PUT:', function() {
		// variables that span test cases
		var resp, body;

		it('should complete without any errors', function(done) {

			// change Scotland Yard's name and update
			scotlandyard.name = 'Metropolitan Police Service, London';

			client.tenants.id(scotlandyardId).put(scotlandyard, function(err, r, b) {
				assert.ifError(err);
				resp = r;
				body = b;
				done();
			});
		});

		it('should return a valid JSON content type', function() {
			assert.jsonContentType(resp.headers);
		});

		it('should respond with a 200 status code', function() {
			assert.strictEqual(resp.statusCode, 200);
		});
		
	});

	describe('GET: (after updating)', function() {
		// variables that span test cases
		var body;

		it('should complete without any errors', function(done) {
			client.tenants.id(scotlandyardId).get(function(err, r, b) {
				assert.ifError(err);
				body = b;
				done();
			});
		});

		it('should return the tenant\'s updated name', function() {
			assert.strictEqual(body.data.name, scotlandyard.name);
		});

	});

	describe('DELETE:', function() {
		// variables that span test cases
		var resp, body;

		it('should complete without any errors', function(done) {
			client.tenants.id(scotlandyardId).delete(function(err, r, b) {
				assert.ifError(err);
				resp = r;
				body = b;
				done();
			});
		});

		it('should return a valid JSON content type', function() {
			assert.jsonContentType(resp.headers);
		});

		it('should respond with a 200 status code', function() {
			assert.strictEqual(resp.statusCode, 200);
		});
		
	});

	// note: more robust 404 testing later on. just verifying for now that
	// the tenant is indeed gone after deleting
	describe('GET: (after deleting)', function() {
		// variables that span test cases
		var resp, body;

		it('should complete without any errors', function(done) {
			client.tenants.id(scotlandyardId).get(function(err, r, b) {
				assert.ifError(err);
				resp = r;
				body = b;
				done();
			});
		});

		it('should respond with a 404 status code', function() {
			assert.strictEqual(resp.statusCode, 404);
		});

	});

});

describe('/tenants/:malformed-id', function() {
	describe('GET:', function() {
		// variables that span test cases
		var resp, body;

		it('should complete without any errors', function(done) {
			client.tenants.id('malformed').get(function(err, r, b) {
				assert.ifError(err);
				resp = r;
				body = b;
				done();
			});
		});

		it('should return a valid JSON content type', function() {
			assert.jsonContentType(resp.headers);
		});

		it('should respond with a 400 status code', function() {
			assert.strictEqual(resp.statusCode, 400);
		});

		it('should return an error entity describing the failure condition', function() {
			assert(body.error);
			assert(/malformed/.test(body.error.reason));
			assert.strictEqual(body.error.status, 400);
		});
	});
});

describe('/tenants/:404', function() {
	describe('GET:', function() {
		// variables that span test cases
		var resp, body;

		it('should complete without any errors', function(done) {
			client.tenants.id('404040404040404040404040').get(function(err, r, b) {
				assert.ifError(err);
				resp = r;
				body = b;
				done();
			});
		});

		it('should return a valid JSON content type', function() {
			assert.jsonContentType(resp.headers);
		});

		it('should respond with a 404 status code', function() {
			assert.strictEqual(resp.statusCode, 404);
		});

		it('should return an error entity describing the failure condition', function() {
			assert(body.error);
			assert(/not found/i.test(body.error.reason));
			assert.strictEqual(body.error.status, 404);
		});
	});
});
