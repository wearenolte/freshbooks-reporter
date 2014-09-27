/**
 * ContractorController
 *
 * @description :: Server-side logic for managing contractors
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
  refreshAll: function(req, res) {

    Freshbooks.api().call("project.list", {per_page: 100}, function(err, response) {
      var projects = response.response.projects.project;
      var rawContractors = [];
      var contractorCount = 0;

      _.each(projects, function(project) {
        if (project.contractors.contractor) {
          rawContractors = rawContractors.concat(project.contractors.contractor);
        };

        if(project.staff.staff) {
          rawContractors = rawContractors.concat(project.staff.staff);
        };
      });

      rawContractors = _.uniq(rawContractors, function(rawContractor) {
        return rawContractor.staff_id || rawContractor.contractor_id;
      });
      _.each(rawContractors, function(contractor) {
        var id = contractor.contractor_id || contractor.staff_id;

        Freshbooks.api().call("staff.get", {staff_id: id}, function(err, response) {
          Contractor.findOrCreate({staff_id: id}, response.response.staff).exec(function(err, dbContractor) {
            contractorCount++;
            if (contractorCount === rawContractors.length) {
              res.json(200);
            };
          });
        });
      });
    });
  }
};
