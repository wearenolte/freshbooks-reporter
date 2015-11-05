/**
 * ContractorScrapper.js
 *
 * @description :: Contractor Scrapper
 * @docs        :: http://sailsjs.org/#!documentation/services
 */

var q = require('q');

module.exports = {

  startScrapping: function(options) {
    var _this = this;
    var dfd   = q.defer();

    //get all different contractor ids from time entries
    TimeEntry.native(function(err, collection) {
      collection.distinct('staff_id', function(err, staff) {
        async.eachSeries(staff, function(staff_id, callback) {
          Contractor.findOne({staff_id: staff_id}).exec(function(err, con) {
            if (err) 
              callback(err);
            else if (!con) {
              //contractor does not exists yet -> scrap and create contractor
              _this._scapContractor(staff_id, function(contractor){
                if (!contractor)
                  callback(null);
                else {
                  Contractor.create(contractor).exec(function(err, res) {
                    callback(err);
                  });
                }
              });
            }
            else {
              //contractor already exists -> check if there are related time entries in the last month
              var date     = new Date();
              var todayInt = DateFormatter.stringToIntegerDate(DateFormatter.dateToString(date));

              var aMonthAgo = new Date();
              aMonthAgo.setMonth(aMonthAgo.getMonth() - 1);
              var aMonthAgoInt = DateFormatter.stringToIntegerDate(DateFormatter.dateToString(aMonthAgo));

              TimeEntry.findOne({staff_id: staff_id, date: {'>=': aMonthAgoInt, '<': todayInt}}).exec(function(err, te){
                if (err || !te) 
                  callback(err);
                else {
                  //scrap and update contractor
                  _this._scapContractor(staff_id, function(contractor){
                    if (!contractor)
                      callback(null);
                    else {
                      Contractor.update({staff_id: staff_id}, contractor).exec(function(err, res) {
                        callback(err);
                      });
                    }
                  });
                }
              });
            }
          });
        }, function(err){
          if (err) console.log(err);
          dfd.resolve(true);
        });
      });
    });

    return dfd.promise;
  },

  _scapContractor: function(staff_id, callback) {
    console.log('Scrapping Contractor: ' + staff_id);

    Freshbooks.api().call('staff.get', {staff_id: staff_id}, function(err, response) {
      if (err || !response.response.staff)
        callback(null);
      else {
        var contractor    = response.response.staff;
        var attributes    = ['staff_id', 'first_name', 'last_name', 'email'];
        var theContractor = _.pick(contractor, attributes);

        callback(theContractor);
      }
    });
  }

};
