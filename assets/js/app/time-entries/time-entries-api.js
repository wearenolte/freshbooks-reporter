// -------------------------------------------
//   Time Entries API wrapper
// -------------------------------------------

angular.module('timeEntries.api', ['services.date'])

.provider('timeEntries', {

  getAllTimeEntries: ['timeEntries', function(timeEntries ) {
    return timeEntries.getAllTimeEntries();
  }],

  $get: ['$http', '$q', 'DateService', function($http, $q) {
      var service = {
        getAllTimeEntries: function() {
          var dfd = $q.defer();

          $http({
            method: 'GET',
            url: '/timeEntry?' + "date_from=2014-09-25"
          })
            .then(
              function(response) {
                dfd.resolve(response.data);
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
