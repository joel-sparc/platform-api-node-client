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

		it('should return a data property with _id and uri set', function() {
			assert(body.data);
			assert(body.data._id);
			assert(body.data.uri);

			// store the _id for later use
			sholmesId = body.data._id;
		});

		it('should have a location header with same value as uri', function() {
			assert(resp.headers.location);
			assert(resp.headers.location === body.data.uri);
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

		it('should return a data property with an array value', function() {
			assert(Array.isArray(body.data));
		});

		it('should return the posted user in the first value of the data array', function() {
			assert(body.data.length === 1);
			assert(body.data[0].firstName === sholmes.firstName);
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

		it('should return the posted user in the data value', function() {
			assert(body.data.firstName === sholmes.firstName);
		});

		it('should not return the password property of the user', function() {
			assert(body.data.password === undefined);
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
				console.log(body);
				done();
			});
		});
		
	});
});

/*
		before(function(done) {

			request.get(urlRoot + '/tenants', function(err, r, body) {
				assert.ifError(err);
				resp = r;
				done();
			});
		});
		
		it('should return a valid JSON content type', function() {
			assert.jsonContentType(resp.headers);
		});

		it('should return a valid JSON response body', function() {
			parsed = JSON.parse(resp.body);
		});

		it('should return an empty data array when there are no tenants', function() {
			var data = parsed.data;
			assert(Array.isArray(data));
			assert(data.length === 0);
		});
	});

	describe('POST:', function() {
		// variables that span test cases
		var resp, parsed;

		before(function(done) {
			var opts = {
				url: urlRoot + '/tenants',
				body: qs.stringify(sampleTenant),
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded'
				}
			};

			request.post(opts, function(err, r, body) {
				assert.ifError(err);
				resp = r;
				done();
			});
		});

		it('should return a valid JSON content type', function() {
			assert.jsonContentType(resp.headers);
		});

		it('should return a valid JSON response body', function() {
			parsed = JSON.parse(resp.body);
		});

		it('should return an _id and uri', function() {
			assert(parsed._id);
			assert(parsed.uri);
			// make sure that the uri is form of '/tenants:id' and :id matches _id
			tenantId = parsed._id;
			var tenantUri = parsed.uri;
			assert(/^\/tenants\/.+/.test(tenantUri));
			assert(tenantUri.split('/').pop() === tenantId);
		});
	});

	describe('GET:', function() {
		// variables that span test cases
		var resp, tenant;

		before(function(done) {
			request.get(urlRoot + '/tenants', function(err, r, body) {
				assert.ifError(err);
				resp = r;
				done();
			});
		});
		
		it('should return a populated data array when there are tenants', function() {
			var parsed = JSON.parse(resp.body);
			assert(Array.isArray(parsed.data));
			assert(tenant = parsed.data[0]);
		});

		it('should return a tenant with expected values', function() {
			assert(tenant._id === tenantId);
			assert(tenant.name === sampleTenant.name);
			assert(tenant.slug === sampleTenant.slug);
		});
	});
});

describe('/tenants:id', function() {

	describe('GET', function() {
		// variables that span test cases
		var resp, parsed;

		before(function(done) {
			request.get(urlRoot + '/tenants/' + tenantId, function(err, r, body) {
				assert.ifError(err);
				resp = r;
				done();
			});
		});
		
		it('should return a valid JSON content type', function() {
			assert.jsonContentType(resp.headers);
		});

		it('should return a valid JSON response body', function() {
			parsed = JSON.parse(resp.body);
		});

		it('should return a tenant with expected values', function() {
			assert(parsed._id === tenantId);
			assert(parsed.name === sampleTenant.name);
			assert(parsed.slug === sampleTenant.slug);
		});

	});
});

describe('/tenants:malformed-id', function() {
	describe('GET', function() {
		var resp;

		before(function(done) {
			request.get(urlRoot + '/tenants/malformed', function(err, r, body) {
				assert.ifError(err);
				resp = r;
				done();
			});
		});

		it('should return a 400 status code', function() {
			assert(resp.statusCode === 400);
		});
	});
});

describe('/tenants:not-found-id', function() {
	describe('GET', function() {
		var resp;

		before(function(done) {
			request.get(urlRoot + '/tenants/4ee26ca8aa22b7d23f000001', function(err, r, body) {
				assert.ifError(err);
				resp = r;
				done();
			});
		});

		it('should return a 404 status code', function() {
			assert(resp.statusCode === 404);
		});
	});
});

*/
