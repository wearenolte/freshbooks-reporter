angular.module('dashboard', [
  'security.authorization',
  'contractors.list',
  'contractor.api',
  'projects.list',
  'project.api',
  'timeEntries.list',
  'timeEntries.api',
  'tasks.api',
  'directives.dropdown'
])

.config(['$routeProvider', 'securityAuthorizationProvider', 'contractorProvider', 'projectProvider', 'tasksProvider',
  function ($routeProvider, securityAuthorizationProvider, contractorProvider, projectProvider, tasksProvider) {
    $routeProvider.when('/dashboard', {
      templateUrl:'templates/dashboard/dashboard.tpl.html',
      controller:'DashboardCtrl',
      resolve:{
        authenticatedUser: securityAuthorizationProvider.requireAuthenticatedUser,
        contractors: contractorProvider.getAllContractors,
        projects: projectProvider.getAllProjects,
        tasks: tasksProvider.getAllTasks
      }
    });
}])

.controller('DashboardCtrl', ['$scope', '$http', 'contractors', 'projects', 'tasks',
  function ($scope, $http, contractors, projects, tasks) {
    $scope.contractors = contractors;
    $scope.projects = projects;
    $scope.tasks = tasks;
  }]);
