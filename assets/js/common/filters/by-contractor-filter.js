// -------------------------------------------
//   Filter by contractors
// -------------------------------------------

angular.module('filters.by-contractor', [])

.filter('byContractor', function() {
  return function(input, contractor) {
    if (!contractor) { return input };

    return _.where(input, function(item) {
      return item.staff_id == contractor.staff_id;
    });
  }
});
