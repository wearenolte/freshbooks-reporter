angular.module('contractors.list-directive', ['directives.gravatar'])

.directive('contractorsList', ['$http', function ($http) {
  return {
    restrict: 'A',
    replace: false,
    templateUrl: 'templates/contractors/contractors-list/contractors-list.tpl.html',
    scope: {
      contractors: '='
    },

    link: function($scope, $element, $attrs) {
      $scope.fullName = function(contractor) {
        return contractor.first_name + " " + contractor.last_name;
      };

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
    }
  };
}]);
