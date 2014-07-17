jsdom-eval
==========

eval js inside jsdom for simple testing that requires the dom.
if there are uncought exceptions jsdom-eval will print the trace
along with a snippet showing where the error was thrown

sourcemaps are supports, for both stacktraces and the snippet.

## Usage
`jsdom-eval ./my.js --html ./optional.html`

or

`cat ./my-js | jsdom-eval --html ./optional.html`


## run tape tests in jsdom

`browserify ./my_tape_test.js -d | jsdom-eval | faucet`

## API

jsdom-eval will either eval code from process.stdin or read the file of the first non flag arument. you may also specify an html file that will be loaded into jsdom with the --html or -H flag.

