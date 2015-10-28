angular.module('adduser', [
  'security.authorization'
])

.config(['$routeProvider', 'securityAuthorizationProvider', 
  function ($routeProvider, securityAuthorizationProvider) {
    $routeProvider.when('/adduser', {
      templateUrl:'templates/adduser/adduser.tpl.html',
      controller:'AddUserCtrl',
      resolve:{
        authenticatedUser: securityAuthorizationProvider.requireAuthenticatedUser
      }
    });
  }
])

.controller('AddUserCtrl', ['$scope', '$http', 'toastr',
  function ($scope, $http, toastr) {
    $scope.addUser = function(user) {
      $http.post('/user/add', {data: user}).then(function(response) {
        toastr.success("User successfully added");
        $('#username').val('');
        $('#password').val('');
      }, function(err) {
        toastr.error("Internal error: Could not add user");
      });
    }
  }
]);

