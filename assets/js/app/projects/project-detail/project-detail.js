angular.module('project-detail', [
  'security.authorization',
  'contractor.api',
  'project.api'
])

.config(['$routeProvider', 'securityAuthorizationProvider', 'contractorProvider', 'projectProvider',
  function ($routeProvider, securityAuthorizationProvider, contractorProvider, projectProvider) {
    $routeProvider.when('/projects/:projectId', {
      templateUrl:'templates/projects/project-detail/project-detail.tpl.html',
      controller:'ProjectDetailCtrl',
      resolve:{
        authenticatedUser: securityAuthorizationProvider.requireAuthenticatedUser,
        contractors: contractorProvider.getAllContractors,
        project: projectProvider.getProject
      }
    });
}])

.controller('ProjectDetailCtrl', ['$scope', '$location', 'contractors', 'project',
  function ($scope, $location, contractors, project) {

    function filterContractorsByProject (contractors) {
      return _.filter(contractors, function(contractor) {
        var staff = _.isArray(project.staff) ? project.staff : [project.staff];
        return (_.find(staff, function(s){ s.staff.staff_id == contractor.staff_id; }) !== null);
      });
    };

    $scope.project = project;
    $scope.projects = [project];
    $scope.contractors = contractors;
    $scope.projectContractors = filterContractorsByProject(contractors);
  }]);
