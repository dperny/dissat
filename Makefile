all: FORCE
	node prettyprint.js test/test.ds

test: FORCE
	node test/testreader.js

FORCE:

excuses:
