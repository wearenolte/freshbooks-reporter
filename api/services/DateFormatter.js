/**
 * DateFormatter.js
 *
 * @description :: Format dates
 * @docs        :: http://sailsjs.org/#!documentation/services
 */

module.exports = {

  parse: function(date) {
    var year  = date.getFullYear();
    var month = date.getMonth() + 1;
    var day   = date.getDate();

    return year + "-" + (month < 10 ? '0' : '') + month + "-" + (day < 10 ? '0' : '') + day;
  }
};
