/**
 * ParameterManager.js
 *
 * @description :: Parameters database managment
 * @docs        :: http://sailsjs.org/#!documentation/services
 */

module.exports = {
  get: function(name, callback) {
    Parameter.findOne({name: name}).exec(function(err, par){
      callback(err, (par ? par.value : null));
    });
  },

  set: function(name, value, callback) {
    Parameter.findOne({name: name}).exec(function(err, par){
      if (err)
        callback(err);
      else if (!par) {
        Parameter.create({name: name, value: value}).exec(function (err, created){
          callback(err);
        });
      }
      else {
        Parameter.update({name: name}, {value: value}).exec(function (err, updated){
          callback(err);
        });
      }
    });
  },

  unset: function(name, callback) {
    Parameter.destroy({name: name}).exec(function(err){
      callback(err);
    });
  }
};
