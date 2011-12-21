
/**
 * Creates a wrapper around requests to /users, using the provided client object
 * @param  {Client} client The API Client that requests should be sent through
 * @return {Object}
 */
module.exports.getClient = function getUserClient(client) {
	return {
		get: client.request.bind(client, { method: 'GET', path: '/users' })
	};
};