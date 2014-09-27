// -------------------------------------------
//   Time Entries API wrapper
// -------------------------------------------

angular.module('timeEntries.api', ['services.date'])

.provider('timeEntries', {

  getAllTimeEntries: ['timeEntries', function(timeEntries) {
    return timeEntries.getAllTimeEntries();
  }],

  getTimeEntriesForProject: ['$route', 'timeEntries', function($route, timeEntries) {
    return timeEntries.getAllTimeEntries(null, $route.current.pathParams.projectId);
  }],

  $get: ['$http', '$q', 'DateService', function($http, $q, DateService) {
      var service = {
        getAllTimeEntries: function(dayOffset, projectId, limit) {
          var dfd = $q.defer();
          var projectIdRequest = projectId ? ',"project_id":' + projectId + '}' : '}';

          projectId = projectId || '';
          limit = limit || 500;

          $http({
            method: 'GET',
            url: '/timeEntry?' +
              'where={"limit":500,"date":{">=":"' + DateService.getFromDate(dayOffset) + '"}' +
              projectIdRequest + "&limit=" + limit
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
