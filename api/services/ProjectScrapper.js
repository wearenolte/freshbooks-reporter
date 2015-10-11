/**
 * ProjectScrapper.js
 *
 * @description :: Project Scrapper
 * @docs        :: http://sailsjs.org/#!documentation/services
 */

var q = require('q');

module.exports = {

  startScrapping: function(options) {
    var dfd = q.defer();
    var queryOptions = {per_page: 100, page: 1};

    this._startScrappingRec(dfd, queryOptions);

    return dfd.promise;
  },

  _startScrappingRec: function(dfd, queryOptions) {
    var _this = this;
    
    console.log("queryOptions", queryOptions);
    
    Freshbooks.api().call('project.list', queryOptions, function(err, response) {
      if (err) {
        console.error(err);
        return dfd.resolve(true);
      }
      
      if (!response.response.projects) {
        console.log('============ Scrapping Finished ============');
        return dfd.resolve(true);
      }

      ProjectManager.saveProjects(response.response.projects.project)
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
