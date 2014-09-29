/**
 * TimeEntryController
 *
 * @description :: Server-side logic for managing timeentries
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
  refreshAll: function(req, res) {
    TimeEntryScrapper.startScrapping().then(function(err, res) {
      if(err) {
        res.json(500, err);
      } else {
        res.json(200);
      }
    });
  }
};

