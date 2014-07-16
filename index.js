var convert = require('convert-source-map')
  , smap = require('source-map')
  , jsdom = require('jsdom')

var error_regexp = /(\(.*?:undefined:undefined<script>):(\d+):(\d+)\)$/

module.exports = run

function run(script, html, done) {
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
      return done(err)
    }

    Object.keys(console).forEach(function(name) {
      if(typeof console[name] === 'function') {
        window.console[name] = console[name].bind(console)
      }
    })

    process.on('uncaughtException', handle_error)
  }

  function loaded(errs, window) {
    if(errs) {
      errs.forEach(function(err) {
        handle_error(err.data.error)
      })
    }
  }

  function handle_error(err) {
    var stack = err.stack.split('\n')

    err.stack = [stack[0]].concat(stack.slice(1).map(update_line)).join('\n')
    err.originalLocation = get_original(stack[1])
    done(err)
  }

  function update_line(line) {
    var original = get_original(line)
      , new_end

    if(!original) {
      return line
    }

    new_end = '(' + original.source + ':' +
      original.line + ':' + original.column + ')'

    return line.replace(error_regexp, new_end)
  }

  function get_original(line, column) {
    var parts = line.match(error_regexp)

    if(!parts) {
      return
    }

    var original = sourcemap.originalPositionFor({
        line: +parts[2]
      , column: +parts[3]
    })

    original.content = sourcemap.sourceContentFor(original.source).split('\n')

    return original
  }
}
