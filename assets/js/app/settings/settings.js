angular.module('settings', [
  'security.authorization'
])

.config(['$routeProvider', 'securityAuthorizationProvider', 
  function ($routeProvider, securityAuthorizationProvider) {
    $routeProvider.when('/settings', {
      templateUrl:'templates/settings/settings.tpl.html',
      controller:'SettingsCtrl',
      resolve:{
        authenticatedUser: securityAuthorizationProvider.requireAuthenticatedUser
      }
    });
  }
])

.controller('SettingsCtrl', ['$scope', '$http', 'toastr', 'security',
  function ($scope, $http, toastr, security) {
    
    $scope.currentUser = security.currentUser;

    $scope.updUser = function(user) {
      $http.post('/user/update', {data: user}).then(function(response) {
        toastr.success("User successfully updated");
      }, function(err) {
        toastr.error("Internal error: Could not update user");
      });
    }
    
  }
]);

