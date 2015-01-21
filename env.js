var convert = require('convert-source-map')
var smap = require('source-map')
var jsdom = require('jsdom')
var util = require('util')
var attach = require('./stacktrace')

module.exports = run

process.once('message', function(data) {
  run(data.script, data.html, function(data) {
    process.send(data)
  })
})

process.on('uncaughtException', function(err) {
  process.send({method: 'error', message: err.stack})
})

function run(script, html, send) {
  var sourcemap = convert.fromSource(script)

  if(sourcemap) {
    sourcemap = new smap.SourceMapConsumer(sourcemap.toJSON())
  }

  jsdom.env({
    html: html || ' ',
    src: [script],
    created: setup,
    loaded: loaded,
  })

  function setup(err, window) {
    if(err) {
      throw err
    }

    if(sourcemap) {
      attach(sourcemap, window.Error)
    }

    var methods = ['info', 'warn', 'trace']
    methods.forEach(function(method) {
      window.console[method] = logger(method + ':', 'log')
    })

    window.console.log = logger('', 'log')
    window.console.error = logger('', 'error')

    function logger(prefix, method) {
      return function() {
        var args = [].slice.call(arguments)
        send({method: method, message: prefix + util.format.apply(util, arguments)})
      }
    }
  }

  function loaded(errs, window) {
    if(errs && errs.length) {
      throw errs[0].data.error
    }
  }
}
