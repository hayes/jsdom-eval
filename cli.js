#!/usr/bin/env node
var concat = require('concat-stream')
  , jsdom_eval = require('./index')
  , path = require('path')
  , fs = require('fs')

var remaining = 2
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
    jsdom_eval(js, html, log)
  }
}

function got_html(data) {
  html = data.toString()

  if(!--remaining) {
    jsdom_eval(js, html, log)
  }
}

function log(data) {
  console[data.method](data.message)
}
