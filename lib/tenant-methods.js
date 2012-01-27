
/**
 * Creates a wrapper around requests to /tenants, using the provided client object
 * @param  {Client} client The API Client that requests should be sent through
 * @return {Object}
 */
module.exports = function tenantMethods(client) {
	return {

		// GET: /tenants
		get: client.request.bind(client, { method: 'GET', path: '/tenants' }),

		// POST: /tenants
		post: client.request.bind(client, { method: 'POST', path: '/tenants' }),

		id: function(tenantId) {
			if (!tenantId) throw new Error('tenantId is required');

			return {
				
				// GET: /tenants/:id
				get: function(cb) {
					client.request({ method: 'GET', path: '/tenants/' + tenantId }, cb);
				},

				// PUT: /tenants/:id
				put: function(tenant, cb) {
					client.request({ method: 'PUT', path: '/tenants/' + tenantId }, tenant, cb);
				},

				// DELETE: /tenants/:id
				delete: function(cb) {
					client.request({ method: 'DELETE', path: '/tenants/' + tenantId }, cb);
				}

			};
		}

	};
};