angular.module('app', [
  'ngRoute',
  'security'
]);

angular.module('app').config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {
  // $locationProvider.html5Mode(true);
  $routeProvider.otherwise({redirectTo:'/'});
}]);

angular.module('app').run(['security', function(security) {
  // Get the current user when the application starts
  // (in case they are still logged in from a previous session)
  security.requestCurrentUser();
}]);

angular.module('app').controller('AppCtrl', ['$scope', function($scope) {

  $scope.$on('$routeChangeError', function(event, current, previous, rejection){
    console.log("Error changing state");
  });
}]);

angular.module('app').controller('HeaderCtrl', ['$scope', '$location', '$route', 'security',
  function ($scope, $location, $route, security) {
  $scope.location = $location;

  $scope.isAuthenticated = security.isAuthenticated;
  $scope.isAdmin = security.isAdmin;

  $scope.home = function () {
    if (security.isAuthenticated()) {
      $location.path('/dashboard');
    } else {
      $location.path('/projectsinfo');
    }
  };

  $scope.isNavbarActive = function (navBarPath) {
    return navBarPath === breadcrumbs.getFirst().name;
  };

}]);
