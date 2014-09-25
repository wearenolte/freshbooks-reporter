/**
 * ContractorController
 *
 * @description :: Server-side logic for managing contractors
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
  refreshAll: function(req, res) {

    Freshbooks.api.call("project.list", {per_page: 100}, function(err, response) {
      var projects = response.response.projects.project;
      var rawContractors = [];
      var contractors = [];

      _.each(projects, function(project) {
        if (project.contractors.contractor) {
          rawContractors = rawContractors.concat(project.contractors.contractor);
        };
      });

      rawContractors = _.uniq(rawContractors, "contractor_id");

      _.each(rawContractors, function(contractor) {
        Freshbooks.api.call("staff.get", {staff_id: contractor.contractor_id}, function(err, response) {
          Contractor.findOrCreate({staff_id: contractor.contractor_id}, response.response.staff).exec(function(err, dbContractor) {
            console.log("err, dbContractor", err, dbContractor);
          });
        });
      });
    });
  }
};
