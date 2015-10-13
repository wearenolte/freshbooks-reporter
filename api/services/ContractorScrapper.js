/**
 * ContractorScrapper.js
 *
 * @description :: Contractor Scrapper
 * @docs        :: http://sailsjs.org/#!documentation/services
 */

var q = require('q');

module.exports = {

  startScrapping: function(options) {
    var dfd = q.defer();

    TimeEntry.native(function(err, collection) {
      collection.distinct('staff_id', function(err, staff) {
        async.eachSeries(staff, function(staff_id, callback) {
          var queryOptions = {staff_id: staff_id};
          
          console.log("queryOptions", queryOptions);

          Freshbooks.api().call('staff.get', queryOptions, function(err, response) {
            if (err || !response.response.staff)
              callback(null);
            else {
              var contractor = response.response.staff;
              var attributes = ['staff_id', 'first_name', 'last_name', 'email'];
              var theContractor = _.pick(contractor, attributes);

              Contractor.findOne({staff_id: theContractor.staff_id}).exec(function(err, con) {
                if (err) 
                  callback(err);
                else if (!con) {
                  Contractor.create(theContractor).exec(function(err, res) {
                    callback(err);
                  });
                }
                else {
                  Contractor.update({staff_id: theContractor.staff_id}, theContractor).exec(function(err, res) {
                    callback(err);
                  });
                }
              });
            }
          });
        }, function(err){
          if (err) console.error(err);
          console.log('============ Scrapping Finished ============');
          dfd.resolve(true);
        });
      });
    });

    return dfd.promise;
  }

};
