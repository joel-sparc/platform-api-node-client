var assert = require('./helpers/assert'),
	Client = require('../');

// create our Client instance to use for testing
var client = new Client({
	host: 'localhost',
	port: 3210,
	tenant: 'test'
});

// for various test cases
var sholmes = {
	firstName: 'Sherlock',
	lastName: 'Holmes',
	username: 'sholmes',
	password: 'password'
},
// set later on
sholmesId;

describe('/users', function() {

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
			client.users.post(sholmes, function(err, r, b) {
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
			sholmesId = body.data._id;
		});

		it('should have a location header with same value as uri', function() {
			assert.strictEqual(resp.headers.location, body.data.uri);
		});

	});

	describe('GET:', function() {
		// variables that span test cases
		var resp, body;

		it('should complete without any errors', function(done) {
			client.users.get(function(err, r, b) {
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

		it('should return the posted user in the first value of the data array', function() {
			assert.strictEqual(body.data.length, 1);
			assert.strictEqual(body.data[0].firstName, sholmes.firstName);
		});

	});

});

describe('/users?username=:username&password=:password', function() {

	describe('GET:', function() {
		// variables that span test cases
		var resp, body;

		it('should complete without any errors', function(done) {
			client.users.get({ username: sholmes.username, password: sholmes.password }, function(err, r, b) {
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

		it('should return the correct user in the first value of the data array', function() {
			assert.strictEqual(body.data.length, 1);
			assert.strictEqual(body.data[0].firstName, sholmes.firstName);
		});

	});

	describe('GET: (with wrong credentials)', function() {
		// variables that span test cases
		var resp, body;

		it('should complete without any errors', function(done) {
			client.users.get({ username: sholmes.username, password: 'wrong' }, function(err, r, b) {
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

		it('should return no users inside of the data array', function() {
			assert.strictEqual(body.data.length, 0);
		});

	});

});

describe('/users/:id', function() {
	describe('GET:', function() {
		// variables that span test cases
		var resp, body;

		it('should complete without any errors', function(done) {
			client.users.id(sholmesId).get(function(err, r, b) {
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

		it('should return the posted user in the data value', function() {
			assert.strictEqual(body.data.firstName, sholmes.firstName);
		});

		it('should not return the password property of the user', function() {
			assert.strictEqual(body.data.password, undefined);
		});
		
	});

	describe('PUT:', function() {
		// variables that span test cases
		var resp, body;

		it('should complete without any errors', function(done) {

			// change sherlock's username and update
			sholmes.username = 'sherlock.holmes@sparcedge.com';

			client.users.id(sholmesId).put(sholmes, function(err, r, b) {
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
			client.users.id(sholmesId).get(function(err, r, b) {
				assert.ifError(err);
				body = b;
				done();
			});
		});

		it('should return the user\'s updated username', function() {
			assert.strictEqual(body.data.username, sholmes.username);
		});

	});

	describe('DELETE:', function() {
		// variables that span test cases
		var resp, body;

		it('should complete without any errors', function(done) {
			client.users.id(sholmesId).delete(function(err, r, b) {
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
	// the user is indeed gone after deleting
	describe('GET: (after deleting)', function() {
		// variables that span test cases
		var resp, body;

		it('should complete without any errors', function(done) {
			client.users.id(sholmesId).get(function(err, r, b) {
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

describe('/users/:malformed-id', function() {
	describe('GET:', function() {
		// variables that span test cases
		var resp, body;

		it('should complete without any errors', function(done) {
			client.users.id('malformed').get(function(err, r, b) {
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

describe('/users/:404', function() {
	describe('GET:', function() {
		// variables that span test cases
		var resp, body;

		it('should complete without any errors', function(done) {
			client.users.id('404040404040404040404040').get(function(err, r, b) {
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
