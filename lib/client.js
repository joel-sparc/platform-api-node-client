var http = require('http'),
	qs = require('querystring'),
	httpSignature = require('http-signature'),
	TenantClient = require('./tenant-client'),
	tenantMethods = require('./tenant-methods'),
	eventMethods = require('./event-methods');

/**
 * Constructor for a new Client object
 * @param  {Object} opts An Object containing the Client options (host, port, landlord, and key are required)
 * @return {Client}
 */
var Client = module.exports = function Client(opts) {
	var self = this;

	// validate options
	opts || (opts = {});
	['host', 'port', 'landlord', 'key'].forEach(function(key) {
		if (!opts[key]) throw Error('opts.' + key + ' is required');
		self[key] = opts[key];
	});

	self.tenants = tenantMethods(self);
	//disabling tenant-less events until we implement "single-tenant" domains
	//self.events = eventMethods(self);
};

/**
 * High level method for making HTTP requests to the Rest API
 * @param  {Object}   opts An Object containing the request options (method and path are required)
 * @param  {Object}   body When opts.method is POST, PUT, or PATCH, then a request body may be provided
 * @param  {Function} cb   A callback to be invoked when the request has completed
 */
Client.prototype.request = function(opts, body, cb) {
	var self = this;

	// body is optional
	if (typeof cb === 'undefined') {
		cb = body;
		body = undefined;
	}

	// validate options
	opts || (opts = {});
	['method', 'path'].forEach(function(key) {
		if (!opts[key]) throw Error('opts.' + key + ' is required');
	});

	// prepare our query string variables
	var query = opts.query || {};
	query.l = self.landlord;

	// prepare the request options
	var method = opts.method,
		options = {
		host: self.host,
		port: self.port,
		method: method,
		path: opts.path + '?' + qs.stringify(query)
	};

	// determine if we have a request body or not
	var hasRequestBody = (method === 'POST' || method === 'PUT' || method === 'PATCH') && body;

	// handle form encoding headers, if appropriate
	if (hasRequestBody) {
		// set the headers
		options.headers = {
			'Content-Type': 'application/json'
			// @todo: should we set Content-Length or use the default chunked encoding?
		};
	}

	// initiate the actual request
	var req = http.request(options, function(res) {
		res.setEncoding('utf8');
		var buffer = [];
		res.on('data', function(chunk) {
			buffer.push(chunk);
		});
		var parsed;
		res.on('end', function() {
			try {
				// the REST API only returns JSON, so parsing should always be safe
				parsed = JSON.parse(buffer.join(''));
			} catch (e) {
				// i said *should*, didn't i?
				// wrap the parse exception with an explanation
				var returnError = new Error('Expected a JSON response, but response body could not be parsed.');
				returnError.parseError = e;
				return cb(returnError);
			}
			cb(null, res, parsed);
		});
	});

	// pass errors on to the callback
	req.on('error', cb);

	// sign the request
	httpSignature.sign(req, {
		key: self.key,
		keyId: self.landlord
	});

	if(hasRequestBody) { 
		// serialize the body
		body = JSON.stringify(body);
		req.write(body);
	}
	
	// finish the request
	req.end();
};

/**
 * Provides access to tenant-level API methods
 * @param  {String} tenant The slug value for the Tenant to interact with
 * @return {TenantClient}
 */
Client.prototype.tenant = function(tenant) {
	if (!tenant) throw Error('tenant is required');
	return new TenantClient(this, tenant);
};
