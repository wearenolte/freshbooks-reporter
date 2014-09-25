/**
 * Authenticated.js
 *
 * @description :: Authentication wrapper
 * @docs        :: http://sailsjs.org/#!documentation/policies
 */

module.exports = function(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } else {
    return res.json(403, {
      message: 'Not Authorized'
    });
  }
}
