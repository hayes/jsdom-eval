var cp = require('child_process')

module.exports = function run(script, html, handler) {
  if(!handler && typeof html === 'function') {
    handler = html
    html = ''
  }

  var child = cp.fork('./env')
  child.on('message', handler)
  child.send({script: script, html: html})
  return child
}
