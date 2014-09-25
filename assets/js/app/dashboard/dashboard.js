angular.module('dashboard', [
  'security.authorization',
  'contractors.list',
  'contractor.api',
  'projects.list',
  'project.api'
])

.config(['$routeProvider', 'securityAuthorizationProvider', 'contractorProvider', 'projectProvider',
  function ($routeProvider, securityAuthorizationProvider, contractorProvider, projectProvider) {
    $routeProvider.when('/dashboard', {
      templateUrl:'templates/dashboard/dashboard.tpl.html',
      controller:'DashboardCtrl',
      resolve:{
        authenticatedUser: securityAuthorizationProvider.requireAuthenticatedUser,
        contractors: contractorProvider.getAllContractors,
        projects: projectProvider.getAllProjects
      }
    });
}])

.controller('DashboardCtrl', ['$scope', '$location', 'contractors', 'projects',
  function ($scope, $location, contractors, projects) {
    $scope.contractors = contractors;
    $scope.projects = projects;
  }]);
