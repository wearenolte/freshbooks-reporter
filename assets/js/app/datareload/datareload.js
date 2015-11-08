angular.module('datareload', [
  'security.authorization'
])

.config(['$routeProvider', 'securityAuthorizationProvider', 
  function ($routeProvider, securityAuthorizationProvider) {
    $routeProvider.when('/datareload', {
      templateUrl:'templates/datareload/datareload.tpl.html',
      controller:'DataReloadCtrl',
      resolve:{
        authenticatedUser: securityAuthorizationProvider.requireAuthenticatedUser
      }
    });
  }
])

.controller('DataReloadCtrl', ['$scope', '$http', 'toastr',
  function ($scope, $http, toastr) {
    
    $scope.reloadTimeEntries = function() {
      $http.post('/timeEntry/refresh-all', {}).then(function(response) {
        toastr.success("Time Entries data will be reloaded soon");
      }, function(err) {
        toastr.error("Internal error: Could not set reload flag");
      });
    };

    $scope.reloadProjects = function() {
      $http.post('/project/refresh-all', {}).then(function(response) {
        toastr.success("Projects data will be reloaded soon");
      }, function(err) {
        toastr.error("Internal error: Could not set reload flag");
      });
    };

    $scope.reloadContractors = function() {
      $http.post('/contractor/refresh-all', {}).then(function(response) {
        toastr.success("Contractors data will be reloaded soon");
      }, function(err) {
        toastr.error("Internal error: Could not set reload flag");
      });
    };

    $scope.reloadTasks = function() {
      $http.post('/task/refresh-all', {}).then(function(response) {
        toastr.success("Tasks data will be reloaded soon");
      }, function(err) {
        toastr.error("Internal error: Could not set reload flag");
      });
    };
    
  }
]);

