angular.module('dashboard', ['security.authorization'])

.config(['$routeProvider', 'securityAuthorizationProvider', function ($routeProvider, securityAuthorizationProvider) {
  $routeProvider.when('/dashboard', {
    templateUrl:'templates/dashboard/dashboard.tpl.html',
    controller:'DashboardCtrl',
    resolve:{
      authenticatedUser: securityAuthorizationProvider.requireAuthenticatedUser
    }
  });
}])

.controller('DashboardCtrl', ['$scope', '$location', function ($scope, $location) {
}]);
