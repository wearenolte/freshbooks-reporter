angular.module('timeEntries.list-directive', [
  'timeEntries.api',
  'filters.by-contractor'
])

.directive('timeEntriesList', ['timeEntries', function (timeEntries) {
  return {
    restrict: 'A',
    replace: false,
    templateUrl: 'templates/time-entries/time-entries-list/time-entries-list.tpl.html',
    scope: {
      projects: '=',
      contractors: '=',
      currentContractor: '=',
      filterByProject: '='
    },
    link: function($scope, $element, $attrs) {
      var parseTimeEntries = function(timeEntries) {
        return _.map(timeEntries, function(timeEntry) {
          timeEntry.contractor = _.find($scope.contractors, {staff_id: timeEntry.staff_id.toString()});
          timeEntry.project = _.find($scope.projects, {project_id: timeEntry.project_id.toString()});
          return timeEntry;
        });
      };

      $scope.dateFilters = [
        {
          name: "Today",
          dayOffset: 0
        }, {
          name: "This Week",
          dayOffset: 7
        }, {
          name: "This Month",
          dayOffset: 30
        }, {
          name: "Last Year",
          dayOffset: 365
        }
      ];

      $scope.setDateFilter = function(dateFilter) {
        $scope.currentDateFilter = dateFilter;
        timeEntries.getAllTimeEntries(dateFilter.dayOffset, $scope.filterByProject)
          .then(
            function(response) {
              $scope.timeEntries = parseTimeEntries(response);
          });
      };

      $scope.fullName = function(contractor) {
        if (contractor) {
          return contractor.first_name + " " + contractor.last_name;
        } else {
          return "-";
        };
      };

      $scope.setDateFilter($scope.dateFilters[0]);
    }
  };
}]);
