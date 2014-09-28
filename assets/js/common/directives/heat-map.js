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
            var date = Math.round(new Date(timeEntry.date).getTime() / 1000.0);
            rtn[date] = rtn[date] ? rtn[date] + timeEntry.hours : timeEntry.hours;
          });

          cal.init({
            itemSelector: $element[0],
            domain: "month",
            subDomain: "day",
            data: rtn,
            start: startDate
          });
        });
    }
  };
}])
