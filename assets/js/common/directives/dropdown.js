// -------------------------------------------
//   Wrapper for boostrap dropdown toggle
// -------------------------------------------

angular.module('directives.dropdown', [])

.directive('dropdown', [function() {

  return {
    restrict: 'A',
    link: function(scope, element, attrs) {
      element.dropdown();
    }
  };
}])
