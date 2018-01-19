const util = require('util')

/**
 * Format log message.
 *
 * @param {Request} req
 * @param {Response} res
 */

exports.format = function format(req, res) {
  return util.format('%s %d %s', req.method, res.statusCode, req.originalUrl)
}
