var _ = require('lodash');

/**
 * Module interface.
 */

exports.format = format;

/**
 * Format error as metadata.
 *
 * @param {*} err
 */

function format(err) {
  if (!(err instanceof Error)) return {error: {
    message: err.toString(),
    stack: null,
    code: null
  }};

  return {error: _.pick(err, 'message', 'stack', 'code')};
}