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
    var PAR_RELOAD_PROJECTS     = 'RELOAD_PROJECTS';
    var PAR_RELOAD_CONTRACTORS  = 'RELOAD_CONTRACTORS';

    async.parallel({
      reloadTimeEntries: function(cb){
        ParameterManager.get(PAR_RELOAD_TIME_ENTRIES, cb);
      },
      reloadProjects: function(cb){
        ParameterManager.get(PAR_RELOAD_PROJECTS, cb);
      },
      reloadContractors: function(cb){
        ParameterManager.get(PAR_RELOAD_CONTRACTORS, cb);
      }
    }, function (err, parms){
      if (err)
        console.log(err);
      else {
        var options = {};
        var cleanTimeEntries = false;
        var cleanProjects = false;
        var cleanContractors = false;

        if (!parms.reloadTimeEntries || parms.reloadTimeEntries == '1') {
          cleanTimeEntries = true;

          ParameterManager.set(PAR_RELOAD_TIME_ENTRIES, '0', function(err){
            if (err) console.log(err);
          });
        }
        else {
          //scrap last 30 days (just in case some entries were added with a previous date)
          var dateTo   = new Date();
          var dateFrom = new Date();
          
          dateTo.setDate(dateTo.getDate() + 1);
          options.dateTo = DateFormatter.dateToString(dateTo);

          dateFrom.setDate(dateTo.getDate() - 30);
          options.dateFrom = DateFormatter.dateToString(dateFrom);
        }

        if (!parms.reloadProjects || parms.reloadProjects == '1') {
          cleanProjects = true;

          ParameterManager.set(PAR_RELOAD_PROJECTS, '0', function(err){
            if (err) console.log(err);
          });
        }

        if (!parms.reloadContractors || parms.reloadContractors == '1') {
          cleanContractors = true;

          ParameterManager.set(PAR_RELOAD_CONTRACTORS, '0', function(err){
            if (err) console.log(err);
          });
        }

        async.series([
          function(callback){
            if (cleanTimeEntries) {
              console.info("============ Cleaning Time Entries ============");
              TimeEntry.destroy({}).exec(function(err) {
                if (err) console.log(err);
                callback();
              });
            }
            else
              callback();
          },
          function(callback){
            if (cleanProjects) {
              console.info("============ Cleaning Projects ============");
              Project.destroy({}).exec(function(err) {
                if (err) console.log(err);
                callback();
              });
            }
            else
              callback();
          },
          function(callback){
            if (cleanContractors) {
              console.info("============ Cleaning Contractors ============");
              Contractor.destroy({}).exec(function(err) {
                if (err) console.log(err);
                callback();
              });
            }
            else
              callback();
          },
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
