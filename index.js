var jsdom = require('jsdom')

module.exports = run

function run(script, html, done) {
  return jsdom.env({html: html || ' ', done: setup})

  function setup(err, window) {
    if(err) {
      return done(err)
    }

    Object.keys(console).forEach(function(name) {
      if(typeof console[name] === 'function') {
        window.console[name] = console[name].bind(console)
      }
    })

    window.onerror = done
    window.eval(script.toString())
  }
}
