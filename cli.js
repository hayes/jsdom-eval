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
  jsdom_eval(js, html, on_error)
}

function on_error(err) {
  var original = err.originalLocation

  if(!original || !original.content) {
    console.error(err.stack)
    process.exit(1)
  }


  var first = Math.max(original.line - 5, 0)
  var snipet = original.content.slice(first, 11)

  snipet.splice(
      original.line - first
    , 0
    , new Array(original.column + 1).join(' ') + '^'
  )

  console.error(snipet.join('\n'))
  console.error(err.stack)
  process.exit(1)
}
