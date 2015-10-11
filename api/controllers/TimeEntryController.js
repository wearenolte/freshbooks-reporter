/**
 * TimeEntryController
 *
 * @description :: Server-side logic for managing timeentries
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
  refreshAll: function(req, res) {
    Parameter.update({name: 'RELOAD_TIME_ENTRIES'}, {value: '1'}).exec(function (err, updated){
      if (err) {
        console.log(err);
        res.json(500);
      }
      else
        res.json(200);
    });
  }
};

