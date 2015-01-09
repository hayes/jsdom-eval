var broserify = require('browserify')
var test = require('tape')
var run = require('../index.js')

var messages = [
  "Error\n    at Window.foo (test/errors.js:22:0)\n    at Window.func (test/errors.js:19:0)\n    at [object Object]._onTimeout (test/errors.js:14:0)\n    at Timer.listOnTimeout [as ontimeout] (node_modules/browserify/node_modules/process/browser.js:17:0)",
  "Error\n    at Object.foo [as f] (test/errors.js:34:0)\n    at Window.method (test/errors.js:31:0)\n    at [object Object]._onTimeout (test/errors.js:14:0)\n    at Timer.listOnTimeout [as ontimeout] (node_modules/browserify/node_modules/process/browser.js:17:0)\n    at [object global].<anonymous> (node_modules/browserify/node_modules/process/browser.js:29:0)\n    at process._tickCallback (null:null:null)\n    at process._tickFromSpinner (null:null:null)",
  "Error\n    at Window.<anonymous> (test/errors.js:40:0)\n    at Window.anonFunc (test/errors.js:41:0)\n    at [object Object]._onTimeout (test/errors.js:14:0)\n    at Timer.listOnTimeout [as ontimeout] (node_modules/browserify/node_modules/process/browser.js:17:0)\n    at [object global].<anonymous> (node_modules/browserify/node_modules/process/browser.js:29:0)\n    at process._tickCallback (null:null:null)",
  "Error\n    at Object.o.f [as f] (test/errors.js:47:0)\n    at Window.ananMethod (test/errors.js:51:0)\n    at [object Object]._onTimeout (test/errors.js:14:0)\n    at Timer.listOnTimeout [as ontimeout] (node_modules/browserify/node_modules/process/browser.js:17:0)\n    at [object global].<anonymous> (node_modules/browserify/node_modules/process/browser.js:29:0)\n    at process._tickCallback (null:null:null)",
  "Error\n    at new foo (test/errors.js:59:0)\n    at Window.constructorFunc (test/errors.js:56:0)\n    at [object Object]._onTimeout (test/errors.js:14:0)\n    at Timer.listOnTimeout [as ontimeout] (node_modules/browserify/node_modules/process/browser.js:17:0)\n    at [object global].<anonymous> (node_modules/browserify/node_modules/process/browser.js:29:0)\n    at process._tickCallback (null:null:null)",
  "Error\n    at new foo (test/errors.js:71:0)\n    at Window.constructorMethod (test/errors.js:68:0)\n    at [object Object]._onTimeout (test/errors.js:14:0)\n    at Timer.listOnTimeout [as ontimeout] (node_modules/browserify/node_modules/process/browser.js:17:0)\n    at [object global].<anonymous> (node_modules/browserify/node_modules/process/browser.js:29:0)\n    at process._tickCallback (null:null:null)",
  "Error\n    at new <anonymous> (test/errors.js:77:0)\n    at Window.constructorAnonFunc (test/errors.js:76:0)\n    at [object Object]._onTimeout (test/errors.js:14:0)\n    at Timer.listOnTimeout [as ontimeout] (node_modules/browserify/node_modules/process/browser.js:17:0)\n    at [object global].<anonymous> (node_modules/browserify/node_modules/process/browser.js:29:0)\n    at process._tickCallback (null:null:null)",
  "Error\n    at new o.f (test/errors.js:84:0)\n    at Window.constructorAnanMethod (test/errors.js:88:0)\n    at [object Object]._onTimeout (test/errors.js:14:0)\n    at Timer.listOnTimeout [as ontimeout] (node_modules/browserify/node_modules/process/browser.js:17:0)\n    at [object global].<anonymous> (node_modules/browserify/node_modules/process/browser.js:29:0)\n    at process._tickCallback (null:null:null)",
]

test('errors', function(t) {
  var b = broserify({debug: true})
  var count = 0

  b.add('./test/errors.js')
  t.plan(16)
  b.bundle(function(err, script) {
    run(script.toString(), function(data) {
      t.equal(data.method, 'error')
      t.equal(data.message, messages[count++])
    })
  })
})
