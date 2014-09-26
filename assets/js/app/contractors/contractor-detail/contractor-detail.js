angular.module('contractor-detail', [
  'security.authorization',
  'contractor.api',
  'projects.list',
  'project.api'
])

.config(['$routeProvider', 'securityAuthorizationProvider', 'contractorProvider',
  function ($routeProvider, securityAuthorizationProvider, contractorProvider) {
    $routeProvider.when('/contractor/:contractorId', {
      templateUrl:'templates/contractors/contractor-detail/contractor-detail.tpl.html',
      controller:'ContractorDetailCtrl',
      resolve:{
        authenticatedUser: securityAuthorizationProvider.requireAuthenticatedUser,
        contractor: contractorProvider.getContractor
      }
    });
}])

.controller('ContractorDetailCtrl', ['$scope', '$location', 'contractor',
  function ($scope, $location, contractor) {
    $scope.contractor = contractor;

    $scope.fullName = function(contractor) {
      return contractor.first_name + ' ' + contractor.last_name;
    };
  }]);
