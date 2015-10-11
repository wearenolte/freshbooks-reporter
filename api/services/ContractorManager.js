/**
 * ContractorManager.js
 *
 * @description :: Contractors database managment
 * @docs        :: http://sailsjs.org/#!documentation/services
 */

var q = require('q');

module.exports = {
  saveContractors: function(contractors) {
    var dfd = q.defer();
    var attributes = ['staff_id', 'first_name', 'last_name', 'email'];

    if (!contractors)
      dfd.resolve(true);
    else {
      if (!_.isArray(contractors)) contractors = [contractors];

      async.each(contractors, function(contractor, callback) {
        Contractor.findOne({staff_id: contractor.staff_id}).exec(function(err, con) {
          if (err) 
            callback(err);
          else if (!con) {
            Contractor.create(_.pick(contractor, attributes)).exec(function(err, res) {
              callback(err);
            });
          }
          else {
            Contractor.update({staff_id: contractor.staff_id}, _.pick(contractor, attributes)).exec(function(err, res) {
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
