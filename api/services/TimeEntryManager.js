/**
 * TimeEntryManager.js
 *
 * @description :: Time entries database managment
 * @docs        :: http://sailsjs.org/#!documentation/services
 */

var q = require('q');

module.exports = {
  saveTimeEntries: function(timeEntries) {
    var count = 0;
    var dfd = q.defer();
    _.each(timeEntries, function(timeEntry) {
      TimeEntry.findOrCreate({time_entry_id: timeEntry.time_entry_id}, timeEntry).exec(function(err, res) {
        count++;
        if(err) dfd.reject(false);
        if(count === timeEntries.length) dfd.resolve(true);
      });
    });

    return dfd.promise;
  }
};
