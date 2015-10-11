/**
 * ProjectManager.js
 *
 * @description :: Projects database managment
 * @docs        :: http://sailsjs.org/#!documentation/services
 */

var q = require('q');

module.exports = {
  saveProjects: function(projects) {
    var dfd = q.defer();
    var attributes = ['project_id', 'name', 'description', 'client_id', 'staff'];

    if (!projects)
      dfd.resolve(true);
    else {
      if (!_.isArray(projects)) projects = [projects];

      async.each(projects, function(project, callback) {
        Project.findOne({project_id: project.project_id}).exec(function(err, te) {
          if (err) 
            callback(err);
          else if (!te) {
            Project.create(_.pick(project, attributes)).exec(function(err, res) {
              callback(err);
            });
          }
          else {
            Project.update({project_id: project.project_id}, _.pick(project, attributes)).exec(function(err, res) {
              callback(err);
            });
          }
        });
      }, function(err){
        if (err) 
          dfd.reject(err);
        else
          dfd.resolve(true);
      });
    }

    return dfd.promise;
  }
};
