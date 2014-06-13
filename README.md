jsdom-eval
==========

eval js inside jsdom for simple testing that requires the dom

## Usage
`jsdom ./my.js --html ./optional.html`

or

`cat ./my-js | jsdom-eval --html ./optional.html`


## run tape tests in jsdom

`browserify ./my_tape_test.js | jsdom-eval | faucet`

## API

jsdom-eval will either eval code from process.stdin or read the file of the first non flag arument. you may also specify an html file that will be loaded into jsdom with the --html or -H flag.

