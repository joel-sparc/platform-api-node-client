
/**
 * Creates a wrapper around requests to /users, using the provided client object
 * @param  {Client} client The API Client that requests should be sent through
 * @return {Object}
 */
module.exports = function userMethods(client) {
	return {

		// GET :/users
		get: function(query, cb) {
			// query is optional
			if (arguments.length === 1) {
				cb = query;
				query = undefined;
			}

			// validate query parameters (only username and password are allowed, and they must appear together)
			if (query) {
				if (Object.keys(query).length !== 2 || !query.username || !query.password) {
					var msg = 'Invalid querystring parameters provided to clientusers.get(). '
						+ '`username` and `password` are optional, but when provided must both be present. '
						+ 'No other query string parameters are allowed';
					return cb(new Error(msg));
				}
			}

			client.request({ method: 'GET', path: '/users', query: query }, cb);
		},

		// POST: /users
		post: client.request.bind(client, { method: 'POST', path: '/users' }),

		id: function(userId) {
			if (!userId) throw new Error('userId is required');

			return {
				
				// GET: /users/:id
				// @todo: should all GET methods accept an optional query object as the first param?
				get: function(cb) {
					client.request({ method: 'GET', path: '/users/' + userId }, cb);
				},

				// PUT: /users/:id
				put: function(user, cb) {
					client.request({ method: 'PUT', path: '/users/' + userId }, user, cb);
				},

				// DELETE: /users/:id
				delete: function(cb) {
					client.request({ method: 'DELETE', path: '/users/' + userId }, cb);
				}

			};
		}

	};
};