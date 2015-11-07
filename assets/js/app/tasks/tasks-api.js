// -------------------------------------------
//   Tasks Api
// -------------------------------------------

angular.module('tasks.api', [])

.provider('tasks', {

  getAllTasks: ['tasks', function(tasks) {
    return tasks.getAllTasks();
  }],

  $get: ['$http', '$q', function($http, $q) {
      var service = {
        getAllTasks: function() {
          var dfd = $q.defer();

          $http({
            method: 'GET',
            url: '/task?limit=0&sort=task_id ASC'
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
