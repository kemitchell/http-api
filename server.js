var http = require('http')
var makeHandler = require('./')
var pino = require('pino')

var DIRECTORY = process.env.DIRECTORY || 'data'
var PORT = process.env.PORT || 8080
var configuration = {
  directory: DIRECTORY,
  port: PORT
}

var NAME = require('./package.json').name
var VERSION = require('./package.json').version
var log = pino({name: NAME + '@' + VERSION})

log.info({event: 'data', directory: DIRECTORY})

var requestHandler = makeHandler(configuration, log)
var server = http.createServer(requestHandler)

if (module.parent) {
  module.exports = server
} else {
  process
    .on('SIGTERM', logSignalAndShutDown)
    .on('SIGQUIT', logSignalAndShutDown)
    .on('SIGINT', logSignalAndShutDown)
    .on('uncaughtException', function handleUncaught (exception) {
      log.error(exception)
      shutDown()
    })
  server.listen(PORT, function onListening () {
    var boundPort = this.address().port
    log.info({event: 'listening', port: boundPort})
  })
}

function logSignalAndShutDown () {
  log.info({event: 'signal'})
  shutDown()
}

function shutDown () {
  server.close(function onClosed () {
    log.info({event: 'closed server'})
    process.exit()
  })
}
