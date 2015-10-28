// -------------------------------------------
//   Heat Map Directive
// -------------------------------------------

angular.module('directives.heat-map', ['timeEntries.api'])

.directive('heatMap', ['timeEntries', '$filter', function(timeEntries, $filter) {
  return {
    restrict: 'AE',
    scope: {
      contractor: '='
    },
    link: function($scope, $element, $attrs) {
      var cal = new CalHeatMap({});
      var rtn = {};
      var today = new Date();
      var startDate = today.setMonth(today.getMonth() - 11);

      timeEntries.getAllTimeEntries()
        .then(function(response) {
          var allTimeEntries = $filter('byContractor')(response, $scope.contractor);
          _.each(allTimeEntries, function(timeEntry) {
            var dateStr = timeEntry.date.toString();
            var year = dateStr.substring(0,4);
            var month = dateStr.substring(4,6);
            var day = dateStr.substring(6);
            var date = Math.round(new Date(year, month-1, day).getTime() / 1000.0);
            rtn[date] = rtn[date] ? rtn[date] + timeEntry.hours : timeEntry.hours;
          });

          cal.init({
            itemSelector: $element[0],
            domain: "month",
            subDomain: "day",
            itemName: ["hour", "hours"],
            data: rtn,
            start: startDate
          });
        });
    }
  };
}])
