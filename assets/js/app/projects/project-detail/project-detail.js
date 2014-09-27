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
    $scope.project = project;
    $scope.contractors = _.map(project.contractors.contractor, function(contractor) {
      return _.find(contractors, {staff_id: contractor.contractor_id});
    });
  }]);
