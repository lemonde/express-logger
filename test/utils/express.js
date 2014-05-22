var express = require('express');
var _ = require('lodash');

/**
 * Expose module.
 */

exports.createServer = createServer;

/**
 * Create a new server.
 *
 * @param {Function} middleware
 * @param {Object} options
 */

function createServer(middleware, options){
  var app = express();
  app.use(function (req, res) {
    _.merge(req, options);
    middleware(req, res, function (err) {
      res.setHeader('Content-Type', 'application/json');
      res.statusCode = err ? (err.status || 500) : res.statusCode;
      var body = res.metadata ? _.pick(res, 'metadata', 'body') : res.body;
      res.end(err ? err.message : JSON.stringify(body));
    });
  });
  return app;
}