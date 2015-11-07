/**
 * TimeEntryManager.js
 *
 * @description :: Time entries database managment
 * @docs        :: http://sailsjs.org/#!documentation/services
 */

var q = require('q');

module.exports = {
  saveTimeEntries: function(timeEntries) {
    var dfd = q.defer();

    if (!timeEntries)
      dfd.resolve(true);
    else {
      if (!_.isArray(timeEntries)) timeEntries = [timeEntries];

      async.each(timeEntries, function(timeEntry, callback) {
        timeEntry.date = DateFormatter.stringToIntegerDate(timeEntry.date);

        TimeEntry.findOne({time_entry_id: timeEntry.time_entry_id}).exec(function(err, te) {
          if (err) 
            callback(err);
          else if (!te) {
            TimeEntry.create(timeEntry).exec(function(err, res) {
              callback(err);
            });
          }
          else {
            TimeEntry.update({time_entry_id: timeEntry.time_entry_id}, timeEntry).exec(function(err, res) {
              callback(err);
            });
          }
        });
      }, function(err){
        if (err) 
          dfd.reject(err);
        else
          dfd.resolve(true);
      });
    }

    return dfd.promise;
  }
};
