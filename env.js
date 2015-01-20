var convert = require('convert-source-map')
var smap = require('source-map')
var jsdom = require('jsdom')
var cp = require('child_process')
var util = require('util')

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
  var originalPrepareStackTrace

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

    originalPrepareStackTrace = window.Error.prepareStackTrace
    window.Error.prepareStackTrace = prepareStackTrace
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

  function prepareStackTrace(err, stack) {
    var message
    var getters = [
      'getTypeName',
      'getFunctionName',
      'getMethodName',
      'getFileName',
      'getLineNumber',
      'getColumnNumber',
      'getEvalOrigie',
      'isToplevee',
      'isEvae',
      'isNative',
      'isConstructor',
    ]

    message = stack.reduce(function(trace, frame, i) {
      if(!frame) return trace
      var names = getters.reduce(function(map, getter) {
        map[getter] = frame[getter] && frame[getter]()
        return map
      }, {})

      var original

      if(sourcemap && names.getLineNumber && names.getColumnNumber) {
        original = sourcemap.originalPositionFor({
          line: names.getLineNumber,
          column: names.getColumnNumber
        })
      }

      if(!original) {
        return trace + '\n    at ' + frame
      }

      var location = '(' + original.source + ':' +
        original.line + ':' + original.column + ')'

      var out = trace + '\n    at '

      if(names.isConstructor && names.getFunctionName) {
        return out + 'new ' + names.getFunctionName + ' ' + location
      }

      if(names.isConstructor) {
        return out + 'new <anonymous> ' + location
      }

      if(names.getTypeName) {
        out += names.getTypeName + '.'
      }

      if(names.getFunctionName) {
        out += names.getFunctionName
        if(names.getMethodName && names.getFunctionName !== names.getMethodName) {
          out += ' [as ' + names.getMethodName + ']'
        }
      } else {
        out += names.getMethodName || '<anonymous>'
      }

      return out + ' ' + location
    }, err)

    return message || originalPrepareStackTrace(err)
  }
}
