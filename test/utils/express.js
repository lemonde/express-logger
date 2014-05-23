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

  app.use(function (req, res, next) {
    _.merge(req, options);
    next(options ? options.err : null);
  });

  app.use(middleware);

  app.use(function (err, req, res, next) {
    res.statusCode = err.status || 500;
    res.end(err.message);
  });

  app.use(function (req, res) {
    res.setHeader('Content-Type', 'application/json');
    var body = res.metadata ? _.pick(res, 'metadata', 'body') : res.body;
    res.end(JSON.stringify(body));
  });
  return app;
}