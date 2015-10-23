angular.module('security.service', [])

.factory('security',['$http', '$q', '$location', 'toastr', function($http, $q, $location, toastr) {

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
      $http.post('/login', {username: username, password: password}).then(function(response) {
        service.currentUser = response.data[0];
        redirect('/dashboard');
      }, function(err) {
        toastr.error("Invalid username or password");
      });
    },

    // Logout the current user and redirect
    logout: function() {
      $http.get('/logout').then(function() {
        service.currentUser = null;
        redirect('/login');
      });
    },

    // Ask the backend to see if a user is already authenticated - this may be from a previous session.
    requestCurrentUser: function() {
      $http.get('/current-user').then(function(response) {
        service.currentUser = response.data[0];
      }, function(response) {
        if (response.status === 401) {
          service.currentUser = null;
          redirect('/login')
        };
      });
    },

    // Information about the current user
    currentUser: null,

    // Is the current user authenticated?
    isAuthenticated: function(){
      return Boolean(service.currentUser);
    },

    // Is the current user an adminstrator?
    isAdmin: function() {
      return !!(service.currentUser && service.currentUser.superAdmin);
    }
  };

  return service;
}]);
