var util = require('util')

/**
 * Expose module.
 */

exports.format = format

/**
 * Format log message.
 *
 * @param {Request} req
 * @param {Response} res
 */

function format(req, res) {
  return util.format('%s %d %s', req.method, res.statusCode, req.originalUrl)
}
