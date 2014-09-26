/**
 * TimeEntryController
 *
 * @description :: Server-side logic for managing timeentries
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
	find: function(req, res) {
    Freshbooks.api.call('time_entry.list', {date_from: req.query.date_from}, function(err, response) {
      if (err) {
        res.json(500, err);
      } else {
        res.json(200, response.response.time_entries.time_entry);
      };
    });
  }
};

