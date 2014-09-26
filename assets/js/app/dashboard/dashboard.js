angular.module('dashboard', [
  'security.authorization',
  'contractors.list',
  'contractor.api',
  'projects.list',
  'project.api',
  'timeEntries.api',
  'directives.dropdown'
])

.config(['$routeProvider', 'securityAuthorizationProvider', 'contractorProvider', 'projectProvider', 'timeEntriesProvider',
  function ($routeProvider, securityAuthorizationProvider, contractorProvider, projectProvider, timeEntriesProvider) {
    $routeProvider.when('/dashboard', {
      templateUrl:'templates/dashboard/dashboard.tpl.html',
      controller:'DashboardCtrl',
      resolve:{
        authenticatedUser: securityAuthorizationProvider.requireAuthenticatedUser,
        contractors: contractorProvider.getAllContractors,
        projects: projectProvider.getAllProjects,
        timeEntries: timeEntriesProvider.getAllTimeEntries
      }
    });
}])

.controller('DashboardCtrl', ['$scope', '$http', 'contractors', 'projects', 'timeEntries',
  function ($scope, $http, contractors, projects, timeEntries) {
    var parseTimeEntries = function(timeEntries) {
      return _.map(timeEntries, function(timeEntry) {
        timeEntry.contractor = _.find(contractors, {staff_id: timeEntry.staff_id});
        timeEntry.project = _.find(projects, {project_id: timeEntry.project_id});
        return timeEntry;;
      });
    };

    $scope.contractors = contractors;
    $scope.projects = projects;
    $scope.timeEntries = parseTimeEntries(timeEntries);

    $scope.dateFilters = [
      {
        name: "Today",
        dayOffset: 0
      }, {
        name: "This Week",
        dayOffset: 7
      }, {
        name: "This Month",
        dayOffset: 30
      }, {
        name: "Last Year",
        dayOffset: 365
      }
    ];


    $scope.setDateFilter = function(dateFilter) {
      $scope.currentDateFilter = dateFilter;
    };
    $scope.setDateFilter($scope.dateFilters[0]);

    $scope.fullName = function(contractor) {
      if (contractor) {
        return contractor.first_name + " " + contractor.last_name;
      } else {
        return "-";
      };
    };

    /* TODO: move this logic into a reusable place */

    $scope.refreshContractors = function() {
      $http({
        method: 'POST',
        url: '/contractor/refresh-all'
      })
        .then(
          function(response) {
            console.info("Contractors updated");
          },
          function(error) {
            console.error("Error updating contracts");
          }
        );
    };

  }]);
