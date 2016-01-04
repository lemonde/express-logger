var _ = require('lodash');
var errorFormatter = require('../formatters/error');
var messageFormatter = require('../formatters/message');
var metadataFormatter = require('../formatters/metadata');

/**
 * Module interface.
 */

module.exports = function errorLoggerFactory(options) {
  // Use `console.error` by default.
  var log = options.log || console.error.bind(console);

  var errorFormatterInstance = errorFormatter(options);

  return function errorLogger(err, req, res, next) {
    var start = new Date();

    res.on('finish', function () {
      var duration = new Date() - start;
      var message = messageFormatter.format(req, res);
      var metadata = _.extend(
        metadataFormatter.format(req, res),
        errorFormatterInstance.format(err),
        {durationMs: duration}
      );

      log(message, metadata);
    });

    next(err);
  };
};
