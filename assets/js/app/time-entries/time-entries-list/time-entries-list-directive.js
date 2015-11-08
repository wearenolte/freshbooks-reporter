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
      tasks: '=',
      currentContractor: '=',
      filterByProject: '='
    },
    link: function($scope, $element, $attrs) {
      var parseTimeEntries = function(timeEntries) {
        return _.map(timeEntries, function(timeEntry) {
          timeEntry.contractor = _.find($scope.contractors, {staff_id: timeEntry.staff_id});
          timeEntry.project = _.find($scope.projects, {project_id: timeEntry.project_id});
          timeEntry.task = _.find($scope.tasks, {task_id: timeEntry.task_id});
          return timeEntry;
        });
      };

      $scope.dateFilters = [
        {
          name: "Yesterday",
          dayOffset: 1
        }, {
          name: "Last Week",
          dayOffset: 7
        }, {
          name: "Last Month",
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

      $scope.taskAndNotes = function(timeEntry) {
        if (timeEntry) {
          if (timeEntry.task)
            return '[' + timeEntry.task.name + '] ' + timeEntry.notes;
          else
            return timeEntry.notes;
        } else {
          return "-";
        };
      };

      $scope.dateToString = function(integerDate) {
        var dateStr = integerDate.toString();
        var year = dateStr.substring(2,4);
        var month = dateStr.substring(4,6);
        var day = dateStr.substring(6);
        return month + '/' + day + '/' + year;
      };

      $scope.setDateFilter($scope.dateFilters[0]);
    }
  };
}]);
