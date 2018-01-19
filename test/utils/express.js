const express = require('express')
const _ = require('lodash')

/**
 * Create a new server.
 *
 * @param {Function} middleware
 * @param {Object} options
 */

exports.createServer = function createServer(middleware, options) {
  /* eslint no-unused-vars: "off" */
  const app = express()

  app.use((req, res, next) => {
    _.merge(req, options)
    next(options ? options.err : null)
  })

  app.use(middleware)

  app.use((err, req, res, next) => {
    res.statusCode = err.status || 500
    res.end(err.message)
  })

  app.use((req, res) => {
    res.setHeader('Content-Type', 'application/json')
    const body = res.metadata ? _.pick(res, 'metadata', 'body') : res.body
    res.end(JSON.stringify(body))
  })
  return app
}
