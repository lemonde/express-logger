'use strict';

var _ = require('lodash');

var DEFAULT_PROPERTIES_WHITELIST = [
  // standard properties
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error
  'name',
  'message',
  'stack'
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
    format: function format(errData) {

      // we are in an error handler, we must work at all cost, whatever could be in "errData"
      if (! errData) errData = {};
      var err = {}; // a proper object, sure to be _.pick-able
      // special fields with known default
      err.name = errData.name || 'Error';
      err.message = errData.message || errData.toString();
      // any other field
      _.forEach(options.pickedFields, function(key) {
        err[key] = err[key] || (_.isUndefined(errData[key]) ? null : errData[key]);
      });

      return {error: _.pick(err, options.pickedFields)};
    }
  }
};
