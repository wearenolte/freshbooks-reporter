/**
 * ProjectController
 *
 * @description :: Server-side logic for managing projects
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
  find: function(req, res) {
    Freshbooks.api.call('project.list', {}, function(err, response) {
      if (err) {
        res.json(500, err);
      } else {
        projects = response.response.projects.project;
        res.json(200, projects);
      };
    });
  }
};
