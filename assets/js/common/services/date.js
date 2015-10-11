// -------------------------------------------
//   Date Service
// -------------------------------------------

angular.module('services.date', [])
  .factory('DateService',['$filter', function ($filter) {

    var dateFormat = 'yyyyMMdd';

    var addDays = function (date, days) {
      date.setDate(date.getDate() + days);
      return date;
    };

    return {
      getDate: function() {
        return $filter('date')(new Date(), dateFormat);
      },

      getFromDate: function(dayOffset) {
        dayOffset = typeof dayOffset === "undefined" ? 365 : dayOffset;
        return $filter('date')(addDays(new Date(), -dayOffset), dateFormat);
      }
    }
  }]);
