var _ = require('lodash')
var messageFormatter = require('../formatters/message')
var metadataFormatter = require('../formatters/metadata')

/**
 * Module interface.
 */

module.exports = function requestLoggerFactory(options) {
  // Use `console.error` by default.
  var log = options.log || console.error.bind(console)

  return function requestLogger(req, res, next) {
    var start = new Date()

    res.on('finish', function() {
      var duration = new Date() - start
      var message = messageFormatter.format(req, res)
      var metadata = _.extend(metadataFormatter.format(req, res), {
        durationMs: duration,
      })

      log(message, metadata)
    })

    next()
  }
}
