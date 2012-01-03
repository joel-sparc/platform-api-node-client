
/**
 * Creates a wrapper around requests to /users, using the provided client object
 * @param  {Client} client The API Client that requests should be sent through
 * @return {Object}
 */
module.exports.getClient = function getUserClient(client) {
	return {

		// GET :/users
		get: client.request.bind(client, { method: 'GET', path: '/users' }),

		// POST: /users
		post: client.request.bind(client, { method: 'POST', path: '/users' }),

		id: function(userId) {
			if (!userId) throw new Error('userId is required');

			return {
				
				// GET: /users:id
				get: function(cb) {
					client.request({ method: 'GET', path: '/users/' + userId }, cb);
				}

			};
		}

	};
};