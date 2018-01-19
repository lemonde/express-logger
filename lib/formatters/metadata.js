const remoteip = require('remoteip')
const uaParser = require('ua-parser')
const _ = require('lodash')

/**
 * Format log metadata.
 *
 * @param {Request} req
 * @param {Response} res
 */

exports.format = function format(req, res) {
  const data = {}

  // Define category.
  data.category = 'http-request'

  // User
  if (req.user) data.user = _.pick(req.user, 'id', 'email')

  // Client request.
  data.clientRequest = {}

  // User agent informations.
  const parsedUa = uaParser.parse(req.headers['user-agent'])

  data.clientRequest.ua = {
    browser: parsedUa.ua.toString(),
    os: parsedUa.os.toString(),
    device: parsedUa.device.toString(),
  }

  // Client ip.
  data.clientRequest.ip = remoteip.get(req)

  // Request UUID.
  if (req.uuid) data.clientRequest.uuid = req.uuid

  // Query.
  data.clientRequest.qs = _.cloneDeep(req.query)

  // Headers.
  data.clientRequest.headers = _.clone(req.headers)

  // Path.
  data.clientRequest.path = req.path

  // Status code.
  data.clientRequest.statusCode = res.statusCode

  return data
}
