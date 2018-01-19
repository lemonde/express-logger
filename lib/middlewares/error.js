const errorFormatter = require('../formatters/error')
const messageFormatter = require('../formatters/message')
const metadataFormatter = require('../formatters/metadata')

/**
 * Module interface.
 */

module.exports = function errorLoggerFactory(options) {
  // Use `console.error` by default.
  const log = options.log || console.error.bind(console)

  const errorFormatterInstance = errorFormatter(options)

  return function errorLogger(err, req, res, next) {
    const start = new Date()

    res.on('finish', () => {
      const duration = new Date() - start
      const message = messageFormatter.format(req, res)
      const metadata = {
        ...metadataFormatter.format(req, res),
        ...errorFormatterInstance.format(err),
        durationMs: duration,
      }

      log(message, metadata)
    })

    next(err)
  }
}
