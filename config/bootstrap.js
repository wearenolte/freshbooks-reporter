/**
 * Bootstrap
 * (sails.config.bootstrap)
 *
 * An asynchronous bootstrap function that runs before your Sails app gets lifted.
 * This gives you an opportunity to set up your data model, run jobs, or perform some special logic.
 *
 * For more information on bootstrapping your app, check out:
 * http://sailsjs.org/#/documentation/reference/sails.config/sails.config.bootstrap.html
 */

module.exports.bootstrap = function(cb) {

  function scrap() {
    var PAR_RELOAD_TIME_ENTRIES = 'RELOAD_TIME_ENTRIES';

    async.parallel({
      reloadTimeEntries: function(cb){
        Parameter.findOne({name: PAR_RELOAD_TIME_ENTRIES}).exec(cb);
      }
    }, function (err, parms){
      if (err)
        console.log(err);
      else {
        var options = {};

        if (!parms.reloadTimeEntries) {
          Parameter.create({name: PAR_RELOAD_TIME_ENTRIES, value: '0'}).exec(function (err, updated){
            if (err)
              console.log(err);
          });
        }
        else if (parms.reloadTimeEntries.value == '1') {
          Parameter.update({name: PAR_RELOAD_TIME_ENTRIES}, {value: '0'}).exec(function (err, updated){
            if (err)
              console.log(err);
          });
        }
        else {
          //scrap last 30 days (just in case some entries were added with a previous date)
          var dateTo   = new Date();
          var dateFrom = new Date();
          
          dateTo.setDate(dateTo.getDate() + 1);
          options.dateTo = DateFormatter.parse(dateTo);

          dateFrom.setDate(dateTo.getDate() - 30);
          options.dateFrom = DateFormatter.parse(dateFrom);
        }

        async.series([
          function(callback){
            console.info("============ Fetching Time Entries ============");
            TimeEntryScrapper.startScrapping(options).then(function(err, res) {
              callback();
            });
          },
          function(callback){
            console.info("============ Fetching Projects ============");
            ProjectScrapper.startScrapping().then(function(err, res) {
              callback();
            });
          },
          function(callback){
            console.info("============ Fetching Contractors ============");
            ContractorScrapper.startScrapping().then(function(err, res) {
              callback();
            });
          }
        ]);
      }
    });
  }

  //set initial scrap in 10 seconds
  setTimeout(scrap, 10 * 1000);

  //set periodic scrap each hour
  setInterval(scrap, 60 * 60 * 1000);

  //set mem gc each 15 seconds
  setInterval(function(){
    var memwatch = require('memwatch-next');
    memwatch.gc();
  }, 15 * 1000);

  // It's very important to trigger this callback method when you are finished
  // with the bootstrap!  (otherwise your server will never lift, since it's waiting on the bootstrap)

  cb();
};
