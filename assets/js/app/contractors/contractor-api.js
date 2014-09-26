// -------------------------------------------
//   Contractor Api
// -------------------------------------------

angular.module('contractor.api', [])

.provider('contractor', {

  getAllContractors: ['contractor', function(contractor) {
    return contractor.getAllContractors();
  }],

  getContractor: ['$route', '$routeParams','contractor', function($route, $routeParams, contractor) {
    return contractor.getContractor($route.current.pathParams.contractorId);
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
                dfd.resolve(response.data);
              },
              function(error) {
                dfd.reject(error);
              });

          return dfd.promise;
        },

        getContractor: function(contractorId) {
          var dfd = $q.defer();

          $http({
            method: 'GET',
            url: '/contractor/' + contractorId
          })
            .then(
              function(response) {
                dfd.resolve(response.data);
              },
              function(error) {
                dfd.reject(error);
              }
            );

          return dfd.promise;
        }
      };

      return service;
    }
  ]
});
