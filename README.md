jsdom-eval
==========

eval js inside jsdom for simple testing that requires the dom.
if your scripts include a sourcemap, stack traces will point to
locations in the original source (great for browserify!)

## Usage
`jsdom-eval ./my.js --html ./optional.html`

or

`cat ./my-js | jsdom-eval --html ./optional.html`


## example using browserify and tape to run dom based tests

`browserify ./my_tape_test.js -d | jsdom-eval | faucet`

This pipes to faucet because it will correctly set exit codes for tap output.
jsdom-eval forwards your console output, but it acts like a browser and does
not know anything about exit codes or how to interpret your scripts output.

## API

jsdom-eval will either eval code from process.stdin or read the file of the first non flag arument. you may also specify an html file that will be loaded into jsdom with the --html or -H flag.

