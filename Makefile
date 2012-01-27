.PHONY: build clean test-api

MOCHA = ./node_modules/mocha/bin/mocha

build:
	npm install

clean:
	rm -rf ./node_modules

test-api:
	$(MOCHA) -R list -t 5000 ./test-api/test-tenants.js ./test-api/test-users.js ./test-api/test-events.js
