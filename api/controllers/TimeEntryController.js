/**
 * TimeEntryController
 *
 * @description :: Server-side logic for managing timeentries
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
  refreshAll: function(req, res) {
    var currentPage = 1;
    var fetchPage = function() {
      Freshbooks.api.call('time_entry.list', {per_page: 100, page: currentPage}, function(err, response) {
        if(err) return res.json(500, err);
        if(!response.response.time_entries) return res.json(200);

        TimeEntryManager.saveTimeEntries(response.response.time_entries.time_entry)
          .then(function(err, res) {
            currentPage++;
            console.log("Aboout to request againt");
            fetchPage();
          });
      });
    };

    fetchPage();
  }
};

