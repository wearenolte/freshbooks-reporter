/**
 * User.js
 *
 * @description :: Basic user model
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

var bcrypt = require('bcrypt');

module.exports = {
  attributes: {
    username: {
      type: 'string',
      required: true,
      unique: true
    },

    password: {
      type: 'string',
      required: true
    },

    superAdmin: {
      type: 'boolean',
      defaultsTo: false
    },

    email: {
      type: 'string',
      defaultsTo: ''
    },

    sendNewsletter: {
      type: 'boolean',
      defaultsTo: false
    },

    //Override toJSON method to remove password from API
    toJSON: function() {
      var obj = this.toObject();
      delete obj.password;
      return obj;
    }
  },

  beforeCreate: function(user, cb) {
    bcrypt.genSalt(10, function(err, salt) {
      bcrypt.hash(user.password, salt, function(err, hash) {
        if (err) {
          console.log(err);
          cb(err);
        } else {
          user.password = hash;
          cb(null, user);
        }
      });
    });
  }
};
