angular.module('contractors.list-directive', ['directives.gravatar'])

.directive('contractorsList', function () {
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
    }
  };
});
