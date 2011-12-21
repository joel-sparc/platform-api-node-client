.PHONY: build clean test-api

MOCHA = ./node_modules/mocha/bin/mocha

build:
	npm install

clean:
	rm -rf ./node_modules

test-api:
	$(MOCHA) -R list ./test-api/test-users.js
