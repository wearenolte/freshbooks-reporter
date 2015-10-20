/**
 * ProjectController
 *
 * @description :: Server-side logic for managing projects
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
  find: function(req, res) {
    async.parallel({
      projects: function(callback){
        Project.find().sort('name ASC').exec(callback);
      },
      workedHours: function(callback){
        TimeEntry.find().groupBy('project_id').sum('hours').exec(callback);
      }
    }, function (err, results){
      if (err)
        res.json(500, err);
      else {
        var projects = results.projects;
        var workedHours = results.workedHours;

        _.each(projects, function(project){
          var pwh = _.find(workedHours, function(wh){ return (wh.project_id == project.project_id) });
          project.worked_hours = pwh ? pwh.hours : 0;
          project.budget_hours = project.budget_hours ? project.budget_hours : 0;
        });

        res.json(200, projects);
      }
    });
  },

  findOne: function(req, res) {
    Project.findOne({project_id: req.params.id}, function(err, project) {
      if (err)
        res.json(500, err);
      else
        res.json(200, project);
    });
  },

  refreshAll: function(req, res) {
    ParameterManager.set('RELOAD_PROJECTS', '1', function (err){
      if (err) {
        console.log(err);
        res.json(500);
      }
      else
        res.json(200);
    });
  }
};
