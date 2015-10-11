/**
 * ProjectController
 *
 * @description :: Server-side logic for managing projects
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
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
