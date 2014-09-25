angular.module('login', [])

.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.when('/login', {
      templateUrl: 'templates/login/login.tpl.html',
      controller: 'LoginCtrl',
      resolve: {}
    });
  }
])

.controller('LoginCtrl', ['$scope', '$location', 'security',
  function($scope, $location, security) {
    $scope.login = function(user) {
      security.login(user.username, user.password)
        .then(function() {
          $location.path('/dashboard');
        });
    };
  }
]);
