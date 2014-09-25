// -------------------------------------------
//   Contractor Api
// -------------------------------------------

angular.module('contractor.api', [])

.provider('contractor', {

  getAllContractors: ['contractor', function(contractor) {
    return contractor.getAllContractors();
  }],

  $get: ['$http', '$q', function($http, $q) {
      var service = {
        getAllContractors: function() {
          var dfd = $q.defer();

          $http({
            method: 'GET',
            url: '/contractor'
          })
            .then(
              function(response) {
                dfd.resolve(response.data.contractors);
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
