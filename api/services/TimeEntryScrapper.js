/**
 * TimeEntryScrapper.js
 *
 * @description :: Time entries
 * @docs        :: http://sailsjs.org/#!documentation/services
 */

var q = require('q');

module.exports = {

  currentPage: 1,

  startScrapping: function(options) {
    var dfd = q.defer();
    var _this = this;
    var queryOptions = {per_page: 100, page: _this.currentPage};

    if(options.dateFrom) queryOptions['date_from'] = options.dateFrom;
console.log("queryOptions", queryOptions);
    Freshbooks.api().call('time_entry.list', queryOptions, function(err, response) {
      if (err) return console.error(err);
      if (!response.response.time_entries) {
        console.log('============ Scrapping Finished ============');
        _this.currentPage = 1;
        return dfd.resolve(true);
      }

      TimeEntryManager.saveTimeEntries(response.response.time_entries.time_entry)
        .then(function(err, res) {
          _this.currentPage++;
          console.log('============ Scapping page ' + _this.currentPage + ' ============');
          _this.startScrapping(options);
        });
    });

    return dfd.promise;
  }
};
