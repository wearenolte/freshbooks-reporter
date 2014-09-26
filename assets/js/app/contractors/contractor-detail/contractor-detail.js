angular.module('contractor-detail', [
  'security.authorization',
  'contractor.api',
  'projects.list',
  'project.api'
])

.config(['$routeProvider', 'securityAuthorizationProvider', 'contractorProvider', 'projectProvider',
  function ($routeProvider, securityAuthorizationProvider, contractorProvider, projectProvider) {
    $routeProvider.when('/contractor/:contractorId', {
      templateUrl:'templates/contractors/contractor-detail/contractor-detail.tpl.html',
      controller:'ContractorDetailCtrl',
      resolve:{
        authenticatedUser: securityAuthorizationProvider.requireAuthenticatedUser,
        contractor: contractorProvider.getContractor,
        projects: projectProvider.getAllProjects
      }
    });
}])

.controller('ContractorDetailCtrl', ['$scope', '$location', 'contractor', 'projects',
  function ($scope, $location, contractor, projects) {

    function filterProjectsByContractor (projects) {
      return _.where(projects, function(project) {
        return _.map(project.contractors.contractor, 'contractor_id').indexOf(contractor.staff_id) !== -1;
      });
    };

    $scope.contractor = contractor;
    $scope.projects = projects;
    $scope.contractorProjects = filterProjectsByContractor(projects);

    $scope.fullName = function(contractor) {
      return contractor.first_name + ' ' + contractor.last_name;
    };
  }]);
