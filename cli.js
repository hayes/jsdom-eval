#!/usr/bin/env node
var concat = require('concat-stream')
  , jsdom_eval = require('./index')
  , path = require('path')
  , fs = require('fs')

var on_error = console.error.bind(console)
  , remaining = 2
  , html
  , js

var argv = require('minimist')(process.argv.slice(2))

if(!process.stdin.isTTY) {
  process.stdin.pipe(concat(got_js))
} else if(argv._.length) {
  fs.createReadStream(path.resolve(process.cwd(), argv._[0]))
    .pipe(concat(got_js))
} else {
  --remaining
}

if(argv.html || argv.H) {
  fs.createReadStream(path.resolve(process.cwd(), argv.html || argv.H))
    .pipe(concat(got_html))
} else {
  --remaining
}

function got_js(data) {
  js = data.toString()

  if(!--remaining) {
    run()
  }
}

function got_html(data) {
  html = data.toString()

  if(!--remaining) {
    run()
  }
}

function run() {
  jsdom_eval(js, html, function(err) {
    console.error(err)
    process.exit(1)
  })
}
