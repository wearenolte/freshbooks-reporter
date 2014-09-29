/**
 * DateFormatter.js
 *
 * @description :: Format dates
 * @docs        :: http://sailsjs.org/#!documentation/services
 */

module.exports = {

  parse: function(date) {
    var year = date.getFullYear();
    var rawMonth = date.getMonth() + 1;
    var month = rawMonth < 10 ? "0" + rawMonth : rawMonth;
    var day = date.getDate();

    return year + "-" + month + "-" + day;
  }
};
