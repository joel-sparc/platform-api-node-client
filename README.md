#Platform API Node Client

Node.js module providing a client for the SPARC Platform REST API.

##Prerequisites

The following software must exist on the target machine to install and run the
SPARC Platform Node.js client.

* [Git (for development only)](http://git-scm.com/) -- [install instructions](http://book.git-scm.com/2_installing_git.html)
    * If you need help setting up your public/private RSA keys go [here](http://help.github.com/mac-set-up-git/)
* [Node.js v0.6.x](http://nodejs.org/) -- [install instructions](https://github.com/joyent/node/wiki/Installation)
* [NPM (Node Package Manager) v1.x](http://npmjs.org/) -- [install instructions](https://github.com/isaacs/npm)

##Getting Started

###Installing

The SPARC Platform Node.js client can be installed with npm.

Install from the command line:

    $ cd ~/path/to/your/app
    $ npm install git+https://github.com/sparcedge/platform-api-node-client.git

Note: to specify a specific branch, tag, or sha to install, use the following syntax:

    $ npm install git+https://github.com/sparcedge/platform-api-node-client.git#branch-or-tag-or-sha

Alternatively, if you're registering dependencies in a `package.json` file, you can simply register the client
as another dependency:

    {
        "name": "your-application-name",
        ...
        "dependencies": {
            ...
            "platform-api-node-client": "git+https://github.com/sparcedge/platform-api-node-client.git#v0.0.2"
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
    
API clients are bound to a specific server host and port, and a specific client domain.  The domain value should be
the same value you would provide for the `d` parameter when using the REST API directly.  The key value should be the
private key corresponding with the public key used when defining the domain. E.g.,

    var client = new Client({
        host: 'localhost',
        port: 3000,
        domain: 'sparc',
        key: require('fs').readFileSync(__dirname + '/rsa_private.pem')
    });

All API methods expect the last parameter to be a callback function.  The callback should be in the form of:

    function(err, resp, body) {
        // err: an instance of Error, if one occurred (null otherwise)
        // resp: the native ClientResponse
        // body: the response body, parsed as an object
    }
    
API methods that must be scoped to a particular tenant are accessed through the client's `tenant()` method.  The value
passed to `tenant()` should be the same value you would provide for the `t` parameter when using the REST API directly.
E.g.,

    client.tenant('mi6');

###API Methods

####Tenant Methods

**client.tenants.get(cb)**

Equivalent to a `GET: /tenants` request.

    client.tenants.get(function(err, resp, body) {
        if (err) throw err;
    });

*Example response body:*

    {
        data: [
            { /* tenant a */ },
            { /* tenant b */ }
        ]
    }

**client.tenants.post(tenant, cb)**

Equivalent to a `POST: /tenants` request.

Note: the `slug` value is a unique client-provided identifier that is intended to be human-readable, and friendly
for URL composition.  This value can then be provided in future API requests as the `t` parameter for tenant-scoped
operations.

    var mi6 = {
        name: 'Secret Intelligence Service',
        slug: 'mi6'
    };
    
    client.tenants.post(mi6, function(err, resp, body) {
        if (err) throw err;
    });

*Example response body:*

    {
        data: {
            _id: '4f232bbba075e8e61d0000fc',
            uri: '/tenants/4f232bbba075e8e61d0000fc'
        }
    }

**client.tenants.id(tenantId).get(cb)**

Equivalent to a `GET: /tenants/:id` request.

    client.tenants.id(tenantId).get(function(err, resp, body) {
        if (err) throw err;
    });

*Example response body:*

    {
        data: {
            name: 'Secret Intelligence Service',
            slug: 'mi6',
            _id: '4f0b06b343e63a100400009b'
        }
    }
    
**client.tenants.id(tenantId).put(tenant, cb)**

Equivalent to a `PUT: /tenants/:id` request.

    var mi6 = {
        name: 'Secret Intelligence Service',
        slug: 'mi6'
    };
    
    client.tenants.id(tenantId).put(mi6, function(err, resp, body) {
        if (err) throw err;
    });

*Example response body:*

    {
        data: 'none'
    }
    
**client.tenants.id(tenantId).delete(cb)**

Equivalent to a `DELETE: /tenants/:id` request.
    
    client.tenants.id(tenantId).delete(function(err, resp, body) {
        if (err) throw err;
    });

*Example response body:*

    {
        data: 'none'
    }

####User Methods

**client.tenant(tenant).users.get(cb)**

Equivalent to a `GET: /users` request.

    client.tenant('mi6').users.get(function(err, resp, body) {
        if (err) throw err;
    });

*Example response body:*

    {
        data: [
            { /* user a */ },
            { /* user b */ }
        ]
    }
    
**client.tenant(tenant).users.get({ username, password }, cb)**

Equivalent to a `GET: /users?username=:username&password=:password` request.

The Platform API provides Restful verification of user passwords.  This is performed through "querying" the
users collection with a username and password to match against.  If an empty array is returned, then the username
and password combination were invalid.  If a single user is returned, then it was a valid combination.  At most,
one user will be returned in the data array.

    client.tenant('mi6').users.get({ username: 'jbond', password: 'password' }, function(err, r, b) {
        if (err) throw err;
    });
    
*Example response body:*

    {
        data: [
            /* zero or one user(s) here */
        ]
    }

**client.tenant(tenant).users.post(user, cb)**

Equivalent to a `POST: /users` request.

    var bond = {
        firstName: 'James',
        lastName: 'Bond',
        username: 'thespywholovedyou',
        password: 'IAm007'
    };
    
    client.tenant('mi6').users.post(bond, function(err, resp, body) {
        if (err) throw err;
    });

*Example response body:*

    {
        data: {
            _id: '4f0b038143e63a1004000062',
            uri: '/users/4f0b038143e63a1004000062'
        }
    }

**client.tenant(tenant).users.id(userId).get(cb)**

Equivalent to a `GET: /users/:id` request.

    client.tenant('mi6').users.id(userId).get(function(err, resp, body) {
        if (err) throw err;
    });

*Example response body:*

    {
        data: {
            firstName: 'James',
            lastName: 'Bond',
            username: 'thespywholovedyou',
            _id: '4f0b06b343e63a100400009b'
        }
    }
    
**client.tenant(tenant).users.id(userId).put(user, cb)**

Equivalent to a `PUT: /users/:id` request.

    var bond = {
        firstName: 'James',
        lastName: 'Bond',
        username: 'jbond',
        password: 'IAm007'
    };
    
    client.tenant('mi6').users.id(userId).put(bond, function(err, resp, body) {
        if (err) throw err;
    });

*Example response body:*

    {
        data: 'none'
    }
    
**client.tenant(tenant).users.id(userId).delete(cb)**

Equivalent to a `DELETE: /users/:id` request.
    
    client.tenant('mi6').users.id(userId).delete(function(err, resp, body) {
        if (err) throw err;
    });

*Example response body:*

    {
        data: 'none'
    }

####Event Methods

**client.events.post(event, cb)**

Equivalent to a `POST: /events` request.

    var event = {
        timestamp: 1327093708463,
        category: 'user',
        data: {
        	username: 'jbond',
        	action: 'login'
        },
        deltas: {
        	logins: 1
        }
    };
    
    client.events.post(event, function(err, resp, body) {
        if (err) throw err;
    });

*Example response body:*

    {
        data: 'none'
    }

**client.tenant(tenant).events.post(event, cb)**

Equivalent to a `POST: /events` request.

Note: this method is equivalent to the one above, except that it will POST a tenant-level Event, rather than a
domain-level event.

##Running Tests (for internal developers):

Start the API server on localhost using the test-api environment:

    $ cd /path/to/platform-api-server/
    $ NODE_ENV='test-api' node app.js

Start the test suite:

    $ cd /path/to/platform-api-node-client/
    $ make test-api
