angular.module('contractor-detail', [
  'security.authorization',
  'contractor.api',
  'projects.list',
  'project.api',
  'directives.heat-map'
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
      return _.filter(projects, function(project) {
        var staff = _.isArray(project.staff) ? project.staff : [project.staff];
        return (_.find(staff, function(s){ s.staff.staff_id == contractor.staff_id; }) !== null);
      });
    };

    $scope.contractor = contractor;
    $scope.contractors = [contractor];
    $scope.projects = projects;
    $scope.contractorProjects = filterProjectsByContractor(projects);
  }]);
