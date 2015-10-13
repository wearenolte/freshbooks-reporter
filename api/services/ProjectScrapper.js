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

    TimeEntry.native(function(err, collection) {
      collection.distinct('project_id', function(err, projects) {
        async.eachSeries(projects, function(project_id, callback) {
          var queryOptions = {project_id: project_id};
          
          console.log("queryOptions", queryOptions);

          Freshbooks.api().call('project.get', queryOptions, function(err, response) {
            if (err || !response.response.project)
              callback(null);
            else {
              var project = response.response.project;
              var attributes = ['project_id', 'name', 'description', 'client_id', 'staff'];
              var theProject = _.pick(project, attributes);

              theProject.client_id = theProject.client_id > 0 ? theProject.client_id : 0;

              if (project.budget && project.budget.hours)
                theProject.budget_hours = parseFloat(project.budget.hours);
              else
                theProject.budget_hours = 0;

              Project.findOne({project_id: theProject.project_id}).exec(function(err, p) {
                if (err) 
                  callback(err);
                else if (!p) {
                  Project.create(theProject).exec(function(err, res) {
                    callback(err);
                  });
                }
                else {
                  Project.update({project_id: theProject.project_id}, theProject).exec(function(err, res) {
                    callback(err);
                  });
                }
              });
            }
          });
        }, function(err){
          if (err) console.error(err);
          console.log('============ Scrapping Finished ============');
          dfd.resolve(true);
        });
      });
    });

    return dfd.promise;
  }

};
