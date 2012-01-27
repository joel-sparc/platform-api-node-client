
/**
 * Creates a wrapper around requests to /events, using the provided client object
 * @param  {Client} client The API Client that requests should be sent through
 * @return {Object}
 */
module.exports = function eventMethods(client) {
	return {

		// POST: /users
		post: client.request.bind(client, { method: 'POST', path: '/events' }),

	};
};