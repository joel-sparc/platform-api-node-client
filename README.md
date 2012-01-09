#Platform API Node Client

Node.js module providing a client for the SPARC Platform REST API.

##Prerequisites

The following software must exist on the target machine to install and run the
SPARC Platform Node.js client.

* [Git (for development only)](http://git-scm.com/) -- [install instructions](http://book.git-scm.com/2_installing_git.html)
* [Node.js v0.6.x](http://nodejs.org/) -- [install instructions](https://github.com/joyent/node/wiki/Installation)
* [NPM (Node Package Manager) v1.x](http://npmjs.org/) -- [install instructions](https://github.com/isaacs/npm)

##Getting Started

###Installing

The SPARC Platform Node.js client can be installed with npm.

Install from the command line:

    $ cd ~/path/to/your/app
    $ npm install git@github.com:sparcedge/platform-api-node-client.git

Note: to specify a specific branch, tag, or sha to install, use the following syntax:

    $ npm install git@github.com:sparcedge/platform-api-node-client.git#branch-or-tag-or-sha

Alternatively, if you're registering dependencies in a `package.json` file, you can simply register the client
as another dependency:

    {
        "name": "your-application-name",
        ...
        "dependencies": {
            ...
            // @todo: is this right?
            "platform-api-node-client": "git@github.com:sparcedge/platform-api-node-client.git" 
            ..
        },
        ...
    }

###Development

Assuming the above prerequisites have been met, the following steps may be used 
to set up a local development environment:

Clone the repository:

    $ cd ~/Projects-Or-Other-Parent-Directory
    $ git clone git@github.com:sparcedge/platform-api-node-client.git

Install any module dependencies:

    $ cd platform-api-node-client/
    $ npm install


##Usage

Importing the API client:

    // nothing special here...
    var Client = require('platform-api-node-client');
    
API clients are bound to a specific server host and port, and a specific client tenant.  The tenant value should be
the same value you would supply to the `t` parameter when using the REST API directly.  E.g.,

    var client = new Client({
        host: 'localhost',
        port: 3000,
        tenant: 'sparc'
    });

All API methods expect the last parameter to be a callback function.  The callback should be in the form of:

    function(err, resp, body) {
        // err: an instance of Error, if one occurred (null otherwise)
        // resp: the native ClientResponse
        // body: the response body, parsed as an object
    }

###API Methods

**client.users.get(cb)**

Equivalent to a `GET: /users` request.

    client.users.get(function(err, resp, body) {
        if (err) throw err;
    });

*Example response body:*

    {
        data: [
            { /* user a */ },
            { /* user b */ }
        ]
    }
    
**client.users.get({ username, password }, cb)**

Equivalent to a `GET: /users?username=:username&password=:password` request.

The Platform API provides Restful verification of user passwords.  This is performed through "querying" the
users collection with a username and password to match against.  If an empty array is returned, then the username
and password combination were invalid.  If a single user is returned, then it was a valid combination.  At most,
one user will be returned in the data array.

    client.users.get({ username: 'sholmes', password: 'password' }, function(err, r, b) {
        if (err) throw err;
	});
    
*Example response body:*

    {
        data: [
            /* zero or one user(s) here */
        ]
    }

**client.users.post(user, cb)**

Equivalent to a `POST: /users` request.

    var sholmes = {
        firstName: 'Sherlock',
        lastName: 'Holmes',
        username: 'sholmes',
        password: 'password'
    };
    
    client.users.post(sholmes, function(err, resp, body) {
        if (err) throw err;
    });

*Example response body:*

    {
        data: {
            _id: '4f0b038143e63a1004000062',
            uri: '/users/4f0b038143e63a1004000062'
        }
    }

**client.users.id(userId).get(cb)**

Equivalent to a `GET: /users/:id` request.

    client.users.id(userId).get(function(err, resp, body) {
        if (err) throw err;
    });

*Example response body:*

    {
        data: {
            firstName: 'Sherlock',
            lastName: 'Holmes',
            username: 'sholmes',
            _id: '4f0b06b343e63a100400009b'
        }
    }
    
**client.users.id(userId).put(user, cb)**

Equivalent to a `PUT: /users/:id` request.

    var sholmes = {
        firstName: 'Sherlock',
        lastName: 'Holmes',
        username: 'sholmes',
        password: 'password'
    };
    
    client.users.id(userId).put(sholmes, function(err, resp, body) {
        if (err) throw err;
    });

*Example response body:*

    {
        data: 'none'
    }
    
**client.users.id(userId).delete(cb)**

Equivalent to a `DELETE: /users/:id` request.
    
    client.users.id(userId).delete(function(err, resp, body) {
        if (err) throw err;
    });

*Example response body:*

    {
        data: 'none'
    }

##Running Tests (for internal developers):

Start the API server on localhost using the test-api environment:

    $ cd /path/to/platform-api-server/
    $ NODE_ENV='test-api' node app.js

Start the test suite:

    $ cd /path/to/platform-api-node-client/
    $ make test-api
