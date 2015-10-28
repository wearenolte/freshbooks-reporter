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
    console.log("============= SCRAP CHECK =============");

    var PAR_RELOAD_TIME_ENTRIES  = 'RELOAD_TIME_ENTRIES';
    var PAR_RELOAD_PROJECTS      = 'RELOAD_PROJECTS';
    var PAR_RELOAD_CONTRACTORS   = 'RELOAD_CONTRACTORS';
    var PAR_LAST_SCRAP_DATE      = 'LAST_SCRAP_DATE';
    var PAR_LAST_NEWSLETTER_DATE = 'LAST_NEWSLETTER_DATE';
    var PAR_SCRAP_ERROR          = 'SCRAP_ERROR';

    async.parallel({
      reloadTimeEntries: function(cb){
        ParameterManager.get(PAR_RELOAD_TIME_ENTRIES, cb);
      },
      reloadProjects: function(cb){
        ParameterManager.get(PAR_RELOAD_PROJECTS, cb);
      },
      reloadContractors: function(cb){
        ParameterManager.get(PAR_RELOAD_CONTRACTORS, cb);
      },
      lastScrap: function(cb){
        ParameterManager.get(PAR_LAST_SCRAP_DATE, cb);
      },
      lastNewsletter: function(cb){
        ParameterManager.get(PAR_LAST_NEWSLETTER_DATE, cb);
      }
    }, function (err, parms){
      if (err)
        console.log(err);
      else {
        var now   = new Date();
        var today = DateFormatter.stringToIntegerDate(DateFormatter.dateToString(now));
        
        var cleanTimeEntries = false;
        var cleanProjects    = false;
        var cleanContractors = false;
        var scrapTimeEntries = false;
        var scrapProjects    = false;
        var scrapContractors = false;
        var sendNewsletter   = false;
        var scrapError       = false;

        var scrapTime      = 5; //do periodic scrap every day after this hour
        var newsletterTime = 9; //send periodic newsletter every day after this hour

        //check complete time entries reload
        if (!parms.reloadTimeEntries || parms.reloadTimeEntries == '1') {
          //clean and scrap everything because projects and contractors depend on time entries
          cleanTimeEntries = true;
          cleanProjects    = true;
          cleanContractors = true;
          scrapTimeEntries = true;
          scrapProjects    = true;
          scrapContractors = true;

          ParameterManager.set(PAR_RELOAD_TIME_ENTRIES, '0', function(err){
            if (err) console.log(err);
          });
        }

        //check complete projects reload
        if (!parms.reloadProjects || parms.reloadProjects == '1') {
          cleanProjects = true;
          scrapProjects = true;

          ParameterManager.set(PAR_RELOAD_PROJECTS, '0', function(err){
            if (err) console.log(err);
          });
        }

        //check complete contractors reload
        if (!parms.reloadContractors || parms.reloadContractors == '1') {
          cleanContractors = true;
          scrapContractors = true;

          ParameterManager.set(PAR_RELOAD_CONTRACTORS, '0', function(err){
            if (err) console.log(err);
          });
        }

        //scrap every day after scrapTime
        if ((!parms.lastScrap || parseInt(parms.lastScrap) < today) && now.getHours() >= scrapTime) {
          scrapTimeEntries = true;
          scrapProjects    = true;
          scrapContractors = true;

          ParameterManager.set(PAR_LAST_SCRAP_DATE, today.toString(), function(err){
            if (err) console.log(err);
          });
        }

        //send newsletter every day after newsletterTime
        if ((!parms.lastNewsletter || parseInt(parms.lastNewsletter) < today) && now.getHours() >= newsletterTime) {
          sendNewsletter = true;

          ParameterManager.set(PAR_LAST_NEWSLETTER_DATE, today.toString(), function(err){
            if (err) console.log(err);
          });
        }

        async.series([
          function(callback){
            if (cleanTimeEntries) {
              console.log("-------- Cleaning Time Entries --------");
              TimeEntry.destroy({}).exec(function(err) {
                if (err) console.log(err);
                console.log("------ End Cleaning Time Entries ------");
                callback();
              });
            }
            else
              callback();
          },
          function(callback){
            if (cleanProjects) {
              console.log("---------- Cleaning Projects ----------");
              Project.destroy({}).exec(function(err) {
                if (err) console.log(err);
                console.log("-------- End Cleaning Projects --------");
                callback();
              });
            }
            else
              callback();
          },
          function(callback){
            if (cleanContractors) {
              console.log("--------- Cleaning Contractors --------");
              Contractor.destroy({}).exec(function(err) {
                if (err) console.log(err);
                console.log("------- End Cleaning Contractors ------");
                callback();
              });
            }
            else
              callback();
          },
          function(callback){
            if (scrapTimeEntries) {
              console.log("-------- Fetching Time Entries --------");
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

              TimeEntryScrapper.startScrapping(options).then(function(res) {
                console.log('------ End Fetching Time Entries ------');

                //clean error parameter
                ParameterManager.unset(PAR_SCRAP_ERROR, function(err){
                  if (err) console.log(err);
                  callback();
                });
              }, function(err) {
                console.log('----- Error Fetching Time Entries -----');
                scrapError = true;

                //set error parameter
                ParameterManager.set(PAR_SCRAP_ERROR, '1', function(err){
                  if (err) console.log(err);

                  //clean scrap date parameter in order to try again on next check
                  ParameterManager.unset(PAR_LAST_SCRAP_DATE, function(err){
                    if (err) console.log(err);
                    callback();
                  });
                });
              });
            }
            else
              callback();
          },
          function(callback){
            if (scrapProjects && !scrapError) {
              console.log("---------- Fetching Projects ----------");
              ProjectScrapper.startScrapping().then(function(res) {
                console.log("-------- End Fetching Projects --------");
                callback();
              });
            }
            else
              callback();
          },
          function(callback){
            if (scrapContractors && !scrapError) {
              console.log("--------- Fetching Contractors --------");
              ContractorScrapper.startScrapping().then(function(res) {
                console.log("------- End Fetching Contractors ------");
                callback();
              });
            }
            else
              callback();
          },
          function(callback){
            if (sendNewsletter) {
              console.log("---------- Sending Newsletter ---------");
              TimeEntryManager.sendNewsletter(function(err) {
                if (err) console.log(err);
                console.log("-------- End Sending Newsletter -------");
                callback();
              });
            }
            else
              callback();
          }
        ],
        function(err, results){
          console.log("=========== END SCRAP CHECK ===========");
        });
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
