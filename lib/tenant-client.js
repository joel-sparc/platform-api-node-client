var userMethods = require('./user-methods'),
	eventMethods = require('./event-methods');

/**
 * TenantClient constructor - exposes tenant-level endpoints, and proxies request
 * through to the provided Client instance.
 * @param {Client} client An instance of Client to defer requests through
 * @param {String} tenant The slug value for the intended Tenant
 */
var TenantClient = module.exports = function TenantClient(client, tenant) {
	this.client = client;
	this.tenant = tenant;

	this.users = userMethods(this);
	this.events = eventMethods(this);
};

/**
 * High level method fo rmaking HTTP Requests to the Rest API.  All requests are automatically
 * decorated with this TenantClient's provided tenant value.
 * @param  {Object}   opts An Object containing the request options (method and path are required)
 * @param  {Object}   body When opts.method is POST, PUT, or PATCH, then a request body may be provided
 * @param  {Function} cb   A callback to be invoked when the request has completed
 */
TenantClient.prototype.request = function(opts, body, cb) {
	// set the tenant property on the querystring
	opts.query || (opts.query = {});
	opts.query.t = this.tenant;
	this.client.request(opts, body, cb);
};
