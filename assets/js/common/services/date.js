// -------------------------------------------
//   Date Service
// -------------------------------------------

angular.module('services.date', [])
  .factory('DateService',['$filter', function ($filter) {

    var dateFormat = 'yyyy-MM-dd';

    var addDays = function (date, days) {
      date.setDate(date.getDate() + days);
      return date;
    };

    return {
      getDate: function() {
        return $filter('date')(new Date(), dateFormat);//2014-09-25
      },

      getFromDate: function(dayOffset) {
        dayOffset = dayOffset || 0;

        return $filter('date')(addDays(new Date(), -dayOffset), dateFormat);
      }
    }
  }]);
