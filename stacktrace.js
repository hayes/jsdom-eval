module.exports = init

function init(sourcemap, Error) {
  Error.prepareStackTrace = prepareStackTrace

  function prepareStackTrace(err, stack) {
    var trace

    try {
      trace = generateTrace(err, stack)
    } catch(e) {
      delete Error.prepareStackTrace
      trace = err.stack
      Error.prepareStackTrace = prepareStackTrace
    }

    return trace
  }

  function generateTrace(err, stack) {
    var message
    var getters = [
      'getTypeName',
      'getFunctionName',
      'getMethodName',
      'getFileName',
      'getLineNumber',
      'getColumnNumber',
      'getEvalOrigin',
      'isTopLevel',
      'isEval',
      'isNative',
      'isConstructor'
    ]

    message = stack.reduce(combineIntoTrace, err)

    return message

    function combineIntoTrace(trace, frame) {
      if(!frame) return trace

      var names = getters.reduce(function(map, getter) {
        try {
          map[getter] = frame[getter] && frame[getter]()
        } catch(e) {
          // uh....
        }
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
    }
  }
}
