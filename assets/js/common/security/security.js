angular.module('security.service', [])

.factory('security',['$http', '$q', '$location', function($http, $q, $location) {

  // Redirect to the given url (defaults to '/')
  function redirect(url) {
    url = url || '/';
    $location.path(url);
  }

  // The public API of the service
  var service = {
    // Show the modal login dialog
    showLogin: function() {
      redirect("/login");
    },

    // Attempt to authenticate a user by the given username and password
    login: function(username, password) {
      var request = $http.post('/login', {username: username, password: password});
      return request.then(function(response) {
        service.currentUser = response.data.user;
        return service.isAuthenticated();
      });
    },

    // Logout the current user and redirect
    logout: function(redirectTo) {
      $http.post('/logout').then(function() {
        service.currentUser = null;
        redirect(redirectTo);
      });
    },

    // Ask the backend to see if a user is already authenticated - this may be from a previous session.
    requestCurrentUser: function() {
      if ( service.isAuthenticated() ) {
        return $q.when(service.currentUser);
      } else {
        return $http.get('/current-user').then(function(response) {
          service.currentUser = response.data[0];
          return service.currentUser;
        });
      }
    },

    // Information about the current user
    currentUser: null,

    // Is the current user authenticated?
    isAuthenticated: function(){
      return !!service.currentUser;
    },

    // Is the current user an adminstrator?
    isAdmin: function() {
      return !!(service.currentUser && service.currentUser.admin);
    }
  };

  return service;
}]);
