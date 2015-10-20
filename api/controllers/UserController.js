/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
  update: function(req, res) {
    var data = rew.params.data;

    User.update(req.user.id, {
      email: data.email,
      sendNewsletter: data.sendNewsletter
    }).exec(function (err, updated){
      if (err) {
        console.log(err);
        res.json(500);
      }
      else
        res.json(200);
    });
  }
};
