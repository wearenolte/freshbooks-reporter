/**
 * Newsletter.js
 *
 * @description :: Daily newsletter sending
 * @docs        :: http://sailsjs.org/#!documentation/services
 */

module.exports = {
  send: function(callback) {
    var sanitizeHtml    = require('sanitize-html');
    var PAR_SCRAP_ERROR = 'SCRAP_ERROR';

    User.find({sendNewsletter: true}).exec(function(err, users){
      if (err)
        callback(err);
      else {
        var toEmails = [];

        _.each(users, function(user){
          if (user.email && user.email.trim() != '')
            toEmails.push(user.email.trim());
        });

        if (toEmails.length == 0)
          callback(null);
        else {
          var date = new Date();
          var todayInt = DateFormatter.stringToIntegerDate(DateFormatter.dateToString(date));

          date.setDate(date.getDate() - 1);
          var yesterdayInt = DateFormatter.stringToIntegerDate(DateFormatter.dateToString(date));

          var aMonthAgo = new Date();
          aMonthAgo.setMonth(aMonthAgo.getMonth() - 1);
          var aMonthAgoInt = DateFormatter.stringToIntegerDate(DateFormatter.dateToString(aMonthAgo));

          async.parallel({
            timeEntries: function(cb){
              TimeEntry.find({date: {'>=': yesterdayInt, '<': todayInt}}).exec(cb);
            },
            projects: function(cb){
              Project.find().exec(cb);
            },
            contractors: function(cb){
              Contractor.find().exec(cb);
            },
            tasks: function(cb){
              Task.find().exec(cb);
            },
            workedHours: function(cb){
              TimeEntry.find().groupBy('project_id').sum('hours').exec(cb);
            },
            activeProjects: function(cb){
              //consider active projects the ones that have time entries in the last month
              TimeEntry.find({date: {'>=': aMonthAgoInt, '<': todayInt}}).exec(function(err, timeEntries){
                if (err) 
                  cb(err, null);
                else {
                  var activeProjects = _.uniq(_.map(timeEntries, 'project_id'));
                  cb(null, activeProjects);
                }
              });
            },
            scrapError: function(cb){
              ParameterManager.get(PAR_SCRAP_ERROR, cb);
            },
          },
          function(err, results) {
            if (err)
              callback(err);
            else {
              var timeEntries    = results.timeEntries;
              var projects       = results.projects;
              var contractors    = results.contractors;
              var tasks          = results.tasks;
              var workedHours    = results.workedHours;
              var activeProjects = results.activeProjects;
              var scrapError     = results.scrapError;

              var blue  = '#253645';
              var pink  = '#F1658C';
              var lgrey = '#F8F8FF';
              var dgrey = '#A0A0A0';
              var white = '#FFFFFF';

              var loggedContractors = [];

              var mailTitle   = 'Daily Newsletter ' + DateFormatter.dateToString(date);
              var mailContent = '';

              mailContent += '<html>';
              mailContent += '<body>';

              //
              // TITLE
              //

              mailContent += '<h1 style="font-size: 13pt; text-align: center; margin-bottom: 20px;">';
              mailContent +=   '<font color="' + blue + '">Freshbooks Reporter - Daily Newsletter</font>';
              mailContent += '</h1>';
              mailContent += '<hr/>';

              if (scrapError && scrapError == '1') {
                mailContent += '<h2 style="font-size: 11pt; margin-top: 20px; margin-bottom: 20px;">';
                mailContent +=   '<font color="' + pink + '">There was an error trying to pull data from Freshbooks, please check server logs for more details.</font>';
                mailContent += '</h2>';
              }
              else {
                //
                // TIME ENTRIES
                //

                mailContent += '<h2 style="font-size: 11pt; margin-top: 20px;">';
                mailContent +=   '<font color="' + blue + '">Team Time Entries for:&nbsp;</font>';
                mailContent +=   '<font color="' + pink + '">' + DateFormatter.dateToString(date) + '</font>';
                mailContent += '</h2>';

                mailContent += '<table style="border-collapse: collapse; width: 100%;">';

                if (timeEntries.length == 0) {
                  mailContent += '<tr>';
                  mailContent +=   '<td colspan="4" style="vertical-align: middle;">';
                  mailContent +=     '<font color="' + dgrey + '" style="font-size: 9pt;">No time entries found :(</font>';
                  mailContent +=   '</td>';
                  mailContent += '</tr>';
                }
                else {
                  //titles
                  mailContent += '<tr>';
                  mailContent +=   '<td colspan="3" style="padding: 8px;">';
                  mailContent +=     '<font color="' + dgrey + '" style="font-size: 9pt;">Contractors, Projects and Notes</font>';
                  mailContent +=   '</td>';
                  mailContent +=   '<td style="padding: 8px;" align="right">';
                  mailContent +=      '<font color="' + dgrey + '" style="font-size: 9pt;">Hours</font>';
                  mailContent +=   '</td>';
                  mailContent += '</tr>';

                  var staffGroup = _.groupBy(timeEntries, function(te) {
                    return te.staff_id;
                  });

                  _.each(staffGroup, function(staff_te, staff_id) {
                    loggedContractors.push(staff_id);

                    var staff       = _.find(contractors, function(con) { return con.staff_id == staff_id; });
                    var staffTotal  = _.reduce(staff_te, function(total, te) { return total + (te.hours || 0); }, 0);

                    //contractor
                    mailContent += '<tr bgcolor="' + blue + '">';
                    mailContent +=   '<td colspan="3" style="padding: 8px;">';
                    mailContent +=     '<font color="' + white + '" style="font-size: 9pt;">' + staff.first_name.toUpperCase() + ' ' + staff.last_name.toUpperCase() + '</font>';
                    mailContent +=   '</td>';
                    mailContent +=   '<td style="padding: 8px;" align="right">';
                    mailContent +=     '<font color="' + white + '" style="font-size: 9pt;">' + staffTotal.toFixed(2) + '</font>';
                    mailContent +=   '</td>';
                    mailContent += '</tr>';

                    var projectsGroup = _.groupBy(staff_te, function(te) {
                      return te.project_id;
                    });

                    _.each(projectsGroup, function(project_te, project_id) {
                      var project      = _.find(projects, function(pro) { return pro.project_id == project_id; });
                      var projectTotal = _.reduce(project_te, function(total, te) { return total + (te.hours || 0); }, 0);

                      //project
                      mailContent += '<tr>';
                      mailContent +=   '<td width="20px" style="padding: 8px;"></td>';
                      mailContent +=   '<td colspan="2" bgcolor="' + pink + '" style="padding: 8px;">';
                      mailContent +=     '<font color="' + white + '" style="font-size: 9pt;">' + project.name.toUpperCase().split('.').join('&#8203;.') + '</font>';
                      mailContent +=   '</td>';
                      mailContent +=   '<td bgcolor="' + pink + '" style="padding: 8px;" align="right">';
                      mailContent +=     '<font color="' + white + '" style="font-size: 9pt;">' + projectTotal.toFixed(2) + '</font>';
                      mailContent +=   '</td>';
                      mailContent += '</tr>';

                      _.each(project_te, function(te) {
                        var task  = _.find(tasks, function(tsk) { return tsk.task_id == te.task_id; });
                        var notes = '';

                        if (task && task.name.trim() != '')
                          notes += '[' + task.name.trim() + '] ';

                        if (te.notes && te.notes.trim() != '')
                          notes += te.notes.trim();
                        else
                          notes += '-';

                        //time entry
                        mailContent += '<tr>';
                        mailContent +=   '<td width="20px" style="padding: 8px;"></td>';
                        mailContent +=   '<td width="20px" style="padding: 8px;"></td>';
                        mailContent +=   '<td bgcolor="' + lgrey + '" style="border-bottom: 1px solid ' + pink + '; padding: 8px; text-align: justify;">';
                        mailContent +=     '<font style="font-size: 8pt;">' + sanitizeHtml(notes) + '</font>';
                        mailContent +=   '</td>';
                        mailContent +=   '<td bgcolor="' + lgrey + '" style="border-bottom: 1px solid ' + pink + '; padding: 8px;" align="right">';
                        mailContent +=     '<font style="font-size: 8pt;">' + te.hours.toFixed(2) + '</font>';
                        mailContent +=   '</td>';
                        mailContent += '</tr>';
                      });
                    });

                    //separator
                    mailContent += '<tr height="20px">';
                    mailContent +=   '<td colspan="4"></td>';
                    mailContent += '</tr>';
                  });
                }

                //
                // CONTRACTORS WHO DID NOT LOGGED TIME
                //

                if (loggedContractors.length != contractors.length) {
                  var names = '';

                  _.each(contractors, function(con) {
                    var found = _.find(loggedContractors, function(staff_id) { return con.staff_id == staff_id; });

                    if (!found)
                      names += (names != '' ? ',&nbsp;&nbsp;' : '') + con.first_name + ' ' + con.last_name;
                  });

                  //note
                  mailContent += '<tr>';
                  mailContent +=   '<td colspan="4" style="padding: 8px; text-align: justify;">';
                  mailContent +=     '<font color="' + blue + '" style="font-style: italic;"><u>NOTE</u>: The following contractors did not log time this day:</font>';
                  mailContent +=   '</td>';
                  mailContent += '</tr>';
                  mailContent += '<tr>';
                  mailContent +=   '<td width="20px" style="padding: 8px;"></td>';
                  mailContent +=   '<td colspan="3" style="padding: 8px; text-align: justify;">';
                  mailContent +=     '<font color="' + blue + '" style="font-style: italic;">' + names + '</font>';
                  mailContent +=   '</td>';
                  mailContent += '</tr>';

                  //separator
                  mailContent += '<tr height="20px">';
                  mailContent +=   '<td colspan="4"></td>';
                  mailContent += '</tr>';
                }
                
                mailContent += '</table>';
                mailContent += '<hr/>';

                //
                // PROJECTS SUMMARY
                //

                mailContent += '<h2 style="font-size: 11pt; margin-top: 20px;">';
                mailContent +=   '<font color="' + blue + '">Active Projects Summary</font>';
                mailContent += '</h2>';
                mailContent += '<table style="border-collapse: collapse; width: 100%; margin-bottom: 25px;">';

                if (activeProjects.length == 0) {
                  mailContent += '<tr>';
                  mailContent +=   '<td colspan="3" style="vertical-align: middle;">';
                  mailContent +=     '<font color="' + dgrey + '" style="font-size: 9pt;">No projects found :(</font>';
                  mailContent +=   '</td>';
                  mailContent += '</tr>';
                }
                else {
                  //titles
                  mailContent += '<tr style="border-bottom: 1px solid ' + pink + ';">';
                  mailContent +=   '<td style="padding: 8px;">';
                  mailContent +=     '<font color="' + dgrey + '" style="font-size: 9pt;">Project</font>';
                  mailContent +=   '</td>';
                  mailContent +=   '<td style="padding: 8px;" align="right">';
                  mailContent +=      '<font color="' + dgrey + '" style="font-size: 9pt;">Budget Hours</font>';
                  mailContent +=   '</td>';
                  mailContent +=   '<td style="padding: 8px;" align="right">';
                  mailContent +=      '<font color="' + dgrey + '" style="font-size: 9pt;">Worked Hours</font>';
                  mailContent +=   '</td>';
                  mailContent += '</tr>';

                  var theProjects = _.filter(projects, function(p) { return _.find(activeProjects, function(ap){ return p.project_id == ap }); });

                  _.each(_.sortBy(theProjects, 'name'), function(project){
                    var pwh = _.find(workedHours, function(wh){ return (wh.project_id == project.project_id) });

                    project.worked_hours = pwh ? pwh.hours : 0;
                    project.budget_hours = project.budget_hours ? project.budget_hours : 0;

                    var rcolor = lgrey;
                    var fcolor = blue;
                    var bcolor = pink;

                    if (project.budget_hours > 0 && project.worked_hours > project.budget_hours) {
                      rcolor = pink;
                      fcolor = white;
                      bcolor = white;
                    }

                    //project
                    mailContent += '<tr bgcolor="' + rcolor + '" style="border-bottom: 1px solid ' + bcolor + ';">';
                    mailContent +=   '<td style="padding: 8px;">';
                    mailContent +=     '<font color="' + fcolor + '" style="font-size: 9pt;">' + project.name.toUpperCase().split('.').join('&#8203;.') + '</font>';
                    mailContent +=   '</td>';
                    mailContent +=   '<td style="padding: 8px;" align="right">';
                    mailContent +=     '<font color="' + fcolor + '" style="font-size: 9pt;">' + (project.budget_hours > 0 ? project.budget_hours.toFixed(2) : '-') + '</font>';
                    mailContent +=   '</td>';
                    mailContent +=   '<td style="padding: 8px;" align="right">';
                    mailContent +=     '<font color="' + fcolor + '" style="font-size: 9pt;">' + project.worked_hours.toFixed(2) + '</font>';
                    mailContent +=   '</td>';
                    mailContent += '</tr>';
                  });
                }

                mailContent += '</table>';
              }

              //
              // SIGNATURE
              //

              mailContent += '<hr/>';
              mailContent += '<table style="border-collapse: collapse; width: 100%;">';
              mailContent += '<tr height="40px" align="center">';
              mailContent +=   '<td style="vertical-align: middle;">';
              mailContent +=     '<a href="https://getmoxied.net/">';
              mailContent +=       '<font color="' + dgrey + '" style="font-size: 7pt; font-family: monospace;">Powered by Moxie Media Group, Inc.</font>';
              mailContent +=     '</a>';
              mailContent +=   '</td>';
              mailContent += '</tr>';
              mailContent += '</table>';

              mailContent += '</body>';
              mailContent += '</html>';

              var mail = {
                to: toEmails,
                subject: mailTitle,
                content: mailContent
              };

              SendGrid.send(mail, callback);
            }
          });
        }
      }
    });
  }
};
