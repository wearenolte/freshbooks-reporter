/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
  add: function(req, res) {
    var data = req.param('data');

    User.create({
      username: data.username,
      password: data.password,
      superAdmin: false,
      email: '',
      sendNewsletter: false
    }).exec(function (err, user){
      if (err) {
        console.log(err);
        res.json(500);
      }
      else
        res.json(200);
    });
  },

  update: function(req, res) {
    var data = req.param('data');

    User.update(req.user[0].id, {
      email: data.email,
      sendNewsletter: data.sendNewsletter
    }).exec(function (err, updated){
      if (err) {
        console.log(err);
        res.json(500);
      }
      else {
        if (req.user && req.user.length > 0 && req.user[0].superAdmin) {
          ParameterManager.set('EXTRA_EMAILS', data.extraEmails, function (err){
            if (err) {
              console.log(err);
              res.json(500);
            }
            else
              res.json(200);
          });
        }
        else
          res.json(200);
      }
    });
  },

  _config: {
    actions: false,
    shortcuts: false,
    rest: false
  }
};
