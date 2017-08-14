var NAME = require('../package.json').name
var VERSION = require('../package.json').version
var routes = module.exports = require('http-hash')()

routes.set('/', function root (request, response, configuration) {
  response.end(JSON.stringify({
    service: NAME || null,
    version: VERSION || null
  }))
})
