angular.module('projects.list-directive', [])

.directive('projectsList', function () {
  return {
    restrict: 'A',
    replace: false,
    templateUrl: 'templates/projects/projects-list/projects-list.tpl.html',
    scope: {
      projects: '='
    }
  };
});
