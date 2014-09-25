// -------------------------------------------
//   Project Api
// -------------------------------------------

angular.module('project.api', [])

.provider('project', {

  getAllProjects: ['project', function(project) {
    return project.getAllProjects();
  }],

  $get: ['$http', '$q', function($http, $q) {
      var service = {
        getAllProjects: function() {
          var dfd = $q.defer();

          $http({
            method: 'GET',
            url: '/project'
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
