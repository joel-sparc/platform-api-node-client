var http = require('http'),
	qs = require('querystring');

/**
 * Constructor for a new Client object
 * @param  {Object} opts An Object containing the Client options (host and port and tenant [slug] are required)
 * @return {Client}
 */
var Client = module.exports = function(opts) {
	var self = this;

	// validate options
	opts || (opts = {});
	['host', 'port', 'tenant'].forEach(function(key) {
		if (!opts[key]) throw Error('opts.' + key + ' is required');
		self[key] = opts[key];
	});

	self.users = require('./user-client').getClient(this);
	self.events = require('./event-client').getClient(this);
};

/**
 * High level method for making HTTP requests to the REST API
 * @param  {Object}   opts An Object containing the request options (method and path are required)
 * @param  {Object}   body When opts.method is POST, PUT, or PATCH, then a request body may be provided
 * @param  {Function} cb   A callback to be invoked when the request has completed
 */
Client.prototype.request = function(opts, body, cb) {
	// body is optional
	if (arguments.length === 2) {
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
	query.t = this.tenant;

	// prepare the request options
	var method = opts.method,
		options = {
		host: this.host,
		port: this.port,
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
		res.on('end', function() {
			try {
				// the REST API only returns JSON, so parsing should always be safe
				var parsed = JSON.parse(buffer.join(''));
				cb(null, res, parsed);
			} catch (e) {
				// i said *should*, didn't i?
				// wrap the parse exception with an explanation
				var returnError = new Error('Expected a JSON response, but response body could not be parsed.');
				returnError.parseError = e;
				cb(returnError);
			}
		});
	});

	// pass errors on to the callback
	req.on('error', cb);

	if(hasRequestBody) { 
		// serialize the body
		body = JSON.stringify(body);
		req.write(body);
	}
	
	// finish the request
	req.end();
};