/**
 * TimeEntryScrapper.js
 *
 * @description :: Time entries
 * @docs        :: http://sailsjs.org/#!documentation/services
 */

var q = require('q');

module.exports = {

  startScrapping: function(options) {
    var dfd = q.defer();
    var queryOptions = {per_page: 100, page: 1};

    if(options.dateFrom) queryOptions['date_from'] = options.dateFrom;
    if(options.dateTo) queryOptions['date_to'] = options.dateTo;

    this._startScrappingRec(dfd, queryOptions);

    return dfd.promise;
  },

  _startScrappingRec: function(dfd, queryOptions) {
    var _this = this;
    
    console.log("queryOptions", queryOptions);
    
    Freshbooks.api().call('time_entry.list', queryOptions, function(err, response) {
      if (err) {
        console.error(err);
        return dfd.resolve(true);
      }
      
      if (!response.response.time_entries) {
        console.log('============ Scrapping Finished ============');
        return dfd.resolve(true);
      }

      TimeEntryManager.saveTimeEntries(response.response.time_entries.time_entry)
        .then(function(err, res) {
          queryOptions.page++;
          console.log('============ Scapping page ' + queryOptions.page + ' ============');
          _this._startScrappingRec(dfd, queryOptions);
        }, function(err) {
          console.log(err);
          return dfd.resolve(true);
        });
    });
  }
};
