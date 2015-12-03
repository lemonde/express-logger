var _ = require('lodash');

var DEFAULT_PROPERTIES_WHITELIST = [
  'message', 'name', // standard properties https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error
  'stack', // node / FF
  'code' // custom, for legacy reasons
];

/**
 * Module interface.
 */

module.exports = function (options) {
  options = options || {};
  options.pickedFields = options.pickedFields || DEFAULT_PROPERTIES_WHITELIST;

  /**
   * Format error as metadata.
   *
   * @param {*} err
   */

  return {
    format: function format(err) {
      if (!(err instanceof Error)) return {error: {
        message: err.toString(),
        stack: null,
        code: null
      }};

      return {error: _.pick(err, options.pickedFields)};
    }
  }
};
