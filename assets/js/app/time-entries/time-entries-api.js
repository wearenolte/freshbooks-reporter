// -------------------------------------------
//   Time Entries API wrapper
// -------------------------------------------

angular.module('timeEntries.api', ['services.date'])

.provider('timeEntries', {

  getAllTimeEntries: ['timeEntries', function(timeEntries) {
    return timeEntries.getAllTimeEntries();
  }],

  $get: ['$http', '$q', 'DateService', function($http, $q, DateService) {
      var service = {
        getAllTimeEntries: function(dayOffset) {
          var dfd = $q.defer();

          $http({
            method: 'GET',
            url: '/timeEntry?' + "date_from=" + DateService.getFromDate(dayOffset)
          })
            .then(
              function(response) {
                var res = _.isArray(response.data) ? response.data : [response.data];
                dfd.resolve(res);
              },
              function(error) {
                dfd.reject(error);
              });

          return dfd.promise;
        }
      };

      return service;
    }
  ]
});
