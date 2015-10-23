angular.module('app', [
  'ngRoute',
  'ngAnimate',
  'angular-loading-bar',
  'toastr',
  'security',
  'login',
  'dashboard',
  'contractor-detail',
  'project-detail',
  'adduser'
]);

angular.module('app').config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {
  // $locationProvider.html5Mode(true);
  $routeProvider.otherwise({redirectTo:'/dashboard'});
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

    $scope.isAuthenticated = function() {
      var res = security.isAuthenticated();
      $('#header-btns').show();
      return res;
    };

    $scope.isActive = function (path) {
      return $location.path() === path;
    };

    $scope.isAdmin = function() {
      return security.isAdmin();
    };

    $scope.logout = function() {
      security.logout();
    };

    $scope.location = $location;

  }
]);
