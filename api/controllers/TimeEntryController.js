/**
 * TimeEntryController
 *
 * @description :: Server-side logic for managing timeentries
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
  refreshAll: function(req, res) {
    ParameterManager.set('RELOAD_TIME_ENTRIES', '1', function (err){
      if (err) {
        console.log(err);
        res.json(500);
      }
      else
        res.json(200);
    });
  }
};

