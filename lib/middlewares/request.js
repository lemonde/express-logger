const messageFormatter = require('../formatters/message')
const metadataFormatter = require('../formatters/metadata')

/**
 * Module interface.
 */

module.exports = function requestLoggerFactory(options) {
  // Use `console.error` by default.
  const log = options.log || console.error.bind(console)

  return function requestLogger(req, res, next) {
    const start = new Date()

    res.on('finish', () => {
      const duration = new Date() - start
      const message = messageFormatter.format(req, res)
      const metadata = {
        ...metadataFormatter.format(req, res),
        durationMs: duration,
      }

      log(message, metadata)
    })

    next()
  }
}
