angular.module('dashboard', [
  'security.authorization',
  'contractors.list',
  'contractor.api',
  'projects.list',
  'project.api',
  'timeEntries.list',
  'timeEntries.api',
  'directives.dropdown'
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

.controller('DashboardCtrl', ['$scope', '$http', 'contractors', 'projects',
  function ($scope, $http, contractors, projects) {

    $scope.contractors = contractors;
    $scope.projects = projects;

    $scope.fullName = function(contractor) {
      if (contractor) {
        return contractor.first_name + " " + contractor.last_name;
      } else {
        return "-";
      };
    };

    /* TODO: move this logic into a reusable place */

    $scope.refreshContractors = function() {
      $http({
        method: 'POST',
        url: '/contractor/refresh-all'
      })
        .then(
          function(response) {
            console.info("Contractors updated");
          },
          function(error) {
            console.error("Error updating contracts");
          }
        );
    };

  }]);
