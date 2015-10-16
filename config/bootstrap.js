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
    console.info("============ SCRAP CHECK ============");

    var PAR_LAST_SCRAP_DATE      = 'LAST_SCRAP_DATE';
    var PAR_LAST_NEWSLETTER_DATE = 'LAST_NEWSLETTER_DATE';
    var PAR_RELOAD_TIME_ENTRIES  = 'RELOAD_TIME_ENTRIES';
    var PAR_RELOAD_PROJECTS      = 'RELOAD_PROJECTS';
    var PAR_RELOAD_CONTRACTORS   = 'RELOAD_CONTRACTORS';

    async.parallel({
      lastScrap: function(cb){
        ParameterManager.get(PAR_LAST_SCRAP_DATE, cb);
      },
      lastNewsletter: function(cb){
        ParameterManager.get(PAR_LAST_NEWSLETTER_DATE, cb);
      },
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
        var today = DateFormatter.stringToIntegerDate(DateFormatter.dateToString(new Date()));
        
        var cleanTimeEntries = false;
        var cleanProjects = false;
        var cleanContractors = false;
        var scrapTimeEntries = false;
        var scrapProjects = false;
        var scrapContractors = false;
        var sendNewsletter = false;

        if (!parms.reloadTimeEntries || parms.reloadTimeEntries == '1') {
          //clean and scrap everything because projects and contractors depend on time entries
          cleanTimeEntries = true;
          cleanProjects = true;
          cleanContractors = true;
          scrapTimeEntries = true;
          scrapProjects = true;
          scrapContractors = true;

          ParameterManager.set(PAR_RELOAD_TIME_ENTRIES, '0', function(err){
            if (err) console.log(err);
          });
        }

        if (!parms.reloadProjects || parms.reloadProjects == '1') {
          cleanProjects = true;
          scrapProjects = true;

          ParameterManager.set(PAR_RELOAD_PROJECTS, '0', function(err){
            if (err) console.log(err);
          });
        }

        if (!parms.reloadContractors || parms.reloadContractors == '1') {
          cleanContractors = true;
          scrapContractors = true;

          ParameterManager.set(PAR_RELOAD_CONTRACTORS, '0', function(err){
            if (err) console.log(err);
          });
        }

        if (!parms.lastScrap || parseInt(parms.lastScrap) < today) {
          scrapTimeEntries = true;
          scrapProjects = true;
          scrapContractors = true;

          ParameterManager.set(PAR_LAST_SCRAP_DATE, today.toString(), function(err){
            if (err) console.log(err);
          });
        }

        if (!parms.lastNewsletter || parseInt(parms.lastNewsletter) < today) {
          sendNewsletter = true;

          ParameterManager.set(PAR_LAST_NEWSLETTER_DATE, today.toString(), function(err){
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
            if (scrapTimeEntries) {
              console.info("============ Fetching Time Entries ============");
              var options = {};

              if (!cleanTimeEntries) {
                //set options to scrap last 30 days (just in case some entries were added with a previous date)
                var dateTo   = new Date();
                var dateFrom = new Date();
                
                dateTo.setDate(dateTo.getDate() + 1);
                options.dateTo = DateFormatter.dateToString(dateTo);

                dateFrom.setDate(dateTo.getDate() - 30);
                options.dateFrom = DateFormatter.dateToString(dateFrom);
              }

              TimeEntryScrapper.startScrapping(options).then(function(err, res) {
                callback();
              });
            }
            else
              callback();
          },
          function(callback){
            if (scrapProjects) {
              console.info("============ Fetching Projects ============");
              ProjectScrapper.startScrapping().then(function(err, res) {
                callback();
              });
            }
            else
              callback();
          },
          function(callback){
            if (scrapContractors) {
              console.info("============ Fetching Contractors ============");
              ContractorScrapper.startScrapping().then(function(err, res) {
                callback();
              });
            }
            else
              callback();
          },
          function(callback){
            if (sendNewsletter) {
              console.info("============ Sending Newsletter ============");
              TimeEntryManager.sendNewsletter(function(err) {
                if (err) console.error(err);
                console.info("============ Finish Sending Newsletter ============");
                callback();
              });
            }
            else
              callback();
          }
        ]);
      }
    });
  }

  //set initial scrap in 10 seconds
  setTimeout(scrap, 10 * 1000);

  //set periodic scrap check each 15 minutes
  setInterval(scrap, 15 * 60 * 1000);

  //set mem gc each 15 seconds
  setInterval(function(){
    var memwatch = require('memwatch-next');
    memwatch.gc();
  }, 15 * 1000);

  // It's very important to trigger this callback method when you are finished
  // with the bootstrap!  (otherwise your server will never lift, since it's waiting on the bootstrap)

  cb();
};
