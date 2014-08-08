var convert = require('convert-source-map')
  , smap = require('source-map')
  , jsdom = require('jsdom')

module.exports = run

function run(script, html) {
  var sourcemap = convert.fromSource(script)

  if(sourcemap) {
    sourcemap = new smap.SourceMapConsumer(sourcemap.toJSON())
  }

  jsdom.env({
      html: html || ' '
    , src: [script]
    , created: setup
    , loaded: loaded
  })

  function setup(err, window) {
    if(err) {
      throw err
    }

    window.Error.prepareStackTrace = prepareStackTrace
    Object.keys(console).forEach(function(name) {
      if(typeof console[name] === 'function') {
        window.console[name] = console[name].bind(console)
      }
    })
  }

  function loaded(errs, window) {
    if(errs && errs.length) {
      throw errs[0].data.error
    }
  }

  function prepareStackTrace(err, stack) {
    return stack.reduce(function(trace, frame) {
      var method = frame.getMethodName()
        , name = frame.getTypeName()
        , out = trace + '\n at '
        , original

      if(sourcemap) {
        original = sourcemap.originalPositionFor({
            line: frame.getLineNumber()
          , column: frame.getColumnNumber()
        })
      }

      if(!original) {
        return out + frame
      }

      if(name === '[object Object]') {
        name = frame.getFunctionName()
      } else if(method === null) {
        name = frame.getTypeName()
        method = frame.getFunctionName()
      }

      return out + ' ' + name + '.' + method + ' (' + original.source + ':' +
        original.line + ':' + original.column + ')'
    }, err)
  }
}
