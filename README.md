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
            "platform-api-node-client": "git+https://github.com/sparcedge/platform-api-node-client.git"
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

####GET: /users

    client.users.get(function(err, resp, body) {
        if (err) throw err;
        
        // body.data is an array of users
    });

####POST: /users

    var sholmes = {
        firstName: 'Sherlock',
        lastName: 'Holmes',
        username: 'sholmes',
        password: 'password'
    };
    
    client.users.post(sholmes, function(err, resp, body) {
        if (err) throw err;

        
    });

##Running Tests (for internal developers):

Start the API server on localhost using the test-api environment:

    $ cd /path/to/platform-api-server/
    $ NODE_ENV='test-api' node app.js

Start the test suite:

    $ cd /path/to/platform-api-node-client/
    $ make test-api
