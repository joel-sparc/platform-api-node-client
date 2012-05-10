/**
 * Creates a wrapper around requests to /events, using the provided client object
 * @param  {Client} client The API Client that requests should be sent through
 * @return {Object}
 */
module.exports = function eventMethods(client) {
	return {

		// GET: /events?q=<query>
		get: function(query, cb) {
			// query is required
			if (arguments.length === 1) {
				return cb(new Error('Only one argument was provided to events.get(). A query object and a callback are required.'));
			}
			client.request({ method: 'GET', path: '/events', query: { q: JSON.stringify(query) } }, cb);
		},

		// POST: /events
		post: client.request.bind(client, { method: 'POST', path: '/events' })

	};
};
