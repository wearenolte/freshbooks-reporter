/**
 * ProjectScrapper.js
 *
 * @description :: Project Scrapper
 * @docs        :: http://sailsjs.org/#!documentation/services
 */

var q = require('q');

module.exports = {

  startScrapping: function(options) {
    var _this = this;
    var dfd   = q.defer();

    //get all different project ids from time entries
    TimeEntry.native(function(err, collection) {
      collection.distinct('project_id', function(err, projects) {
        async.eachSeries(projects, function(project_id, callback) {
          Project.findOne({project_id: project_id}).exec(function(err, proj) {
            if (err) 
              callback(err);
            else if (!proj) {
              //project does not exists yet -> scrap and create project
              _this._scapProject(project_id, function(project){
                if (!project)
                  callback(null);
                else {
                  Project.create(project).exec(function(err, res) {
                    callback(err);
                  });
                }
              });
            }
            else {
              //project already exists -> check if there are related time entries in the last month
              var date     = new Date();
              var todayInt = DateFormatter.stringToIntegerDate(DateFormatter.dateToString(date));

              var aMonthAgo = new Date();
              aMonthAgo.setMonth(aMonthAgo.getMonth() - 1);
              var aMonthAgoInt = DateFormatter.stringToIntegerDate(DateFormatter.dateToString(aMonthAgo));

              TimeEntry.findOne({project_id: project_id, date: {'>=': aMonthAgoInt, '<': todayInt}}).exec(function(err, te){
                if (err || !te) 
                  callback(err);
                else {
                  //scrap and update project
                  _this._scapProject(project_id, function(project){
                    if (!project)
                      callback(null);
                    else {
                      Project.update({project_id: project_id}, project).exec(function(err, res) {
                        callback(err);
                      });
                    }
                  });
                }
              });
            }
          });
        }, function(err){
          if (err) console.log(err);
          dfd.resolve(true);
        });
      });
    });

    return dfd.promise;
  },

  _scapProject: function(project_id, callback) {
    console.log('Scrapping Project: ' + project_id);

    Freshbooks.api().call('project.get', {project_id: project_id}, function(err, response) {
      if (err || !response.response.project)
        callback(null);
      else {
        var project    = response.response.project;
        var attributes = ['project_id', 'name', 'description', 'client_id', 'staff'];
        var theProject = _.pick(project, attributes);

        theProject.client_id = theProject.client_id > 0 ? theProject.client_id : 0;

        if (project.budget && project.budget.hours)
          theProject.budget_hours = parseFloat(project.budget.hours);
        else
          theProject.budget_hours = 0;

        callback(theProject);
      }
    });
  }

};
