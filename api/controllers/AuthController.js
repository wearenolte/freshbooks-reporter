/**
 * AuthController
 *
 * @description :: Server-side logic for managing auths
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

var passport = require("passport");

module.exports = {
  process: function(req, res) {
    passport.authenticate('local', function(err, user, info) {
      if ((err) || (!user)) return res.json(401, err);

      req.login(user, function(err) {
        if (err) return res.json(401, err);
        return res.json(200, user);
      });

    })(req, res);
  },

  logout: function(req, res) {
    req.logout();
    res.json(200, {messages: ['logout successful']});
  },

  currentUser: function(req, res) {
    return res.json(200, req.user);
  },

  _config: {}
};
