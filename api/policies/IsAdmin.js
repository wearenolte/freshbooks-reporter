/**
 * IsAdmin.js
 *
 * @description :: Is Admin wrapper
 * @docs        :: http://sailsjs.org/#!documentation/policies
 */

module.exports = function(req, res, next) {
  if (req.user && req.user.length > 0 && req.user[0].superAdmin) {
    return next();
  } else {
    return res.json(403, {
      message: 'Not Authorized'
    });
  }
}
