/**
 * DateFormatter.js
 *
 * @description :: Format dates
 * @docs        :: http://sailsjs.org/#!documentation/services
 */

module.exports = {

  dateToString: function(date) {
    var year  = date.getFullYear();
    var month = date.getMonth() + 1;
    var day   = date.getDate();
    //format: YYYY-MM-DD
    return year + "-" + (month < 10 ? '0' : '') + month + "-" + (day < 10 ? '0' : '') + day;
  },

  stringToDate: function(input) {
    //format: YYYY-MM-DD
    var parts = input.split('-');
    return new Date(new Date(parts[0], parts[1]-1, parts[2]).getTime());
  },

  stringToIntegerDate: function(input) {
    //format: YYYYMMDD
    var parts = input.split('-');
    var year  = parts[0];
    var month = parts[1];
    var day   = parts[2];
    return parseInt(year + month + day);
  }
};
