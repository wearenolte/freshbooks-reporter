/**
 * TimeEntryManager.js
 *
 * @description :: Time entries database managment
 * @docs        :: http://sailsjs.org/#!documentation/services
 */

var q = require('q');

module.exports = {
  saveTimeEntries: function(timeEntries) {
    var dfd = q.defer();

    if (!timeEntries)
      dfd.resolve(true);
    else {
      if (!_.isArray(timeEntries)) timeEntries = [timeEntries];

      async.each(timeEntries, function(timeEntry, callback) {
        timeEntry.date = DateFormatter.stringToIntegerDate(timeEntry.date);

        TimeEntry.findOne({time_entry_id: timeEntry.time_entry_id}).exec(function(err, te) {
          if (err) 
            callback(err);
          else if (!te) {
            TimeEntry.create(timeEntry).exec(function(err, res) {
              callback(err);
            });
          }
          else {
            TimeEntry.update({time_entry_id: timeEntry.time_entry_id}, timeEntry).exec(function(err, res) {
              callback(err);
            });
          }
        });
      }, function(err){
        if (err) 
          dfd.reject(err);
        else
          dfd.resolve(true);
      });
    }

    return dfd.promise;
  },

  sendNewsletter: function(callback) {
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
          var today = DateFormatter.stringToIntegerDate(DateFormatter.dateToString(date));

          date.setDate(date.getDate() - 1);
          var yesterday = DateFormatter.stringToIntegerDate(DateFormatter.dateToString(date));
          
          async.parallel({
            timeEntries: function(cb){
              TimeEntry.find({date: {'>=': yesterday, '<': today}}).exec(cb);
            },
            projects: function(cb){
              Project.find().exec(cb);
            },
            contractors: function(cb){
              Contractor.find().exec(cb);
            }
          },
          function(err, results) {
            if (err)
              callback(err);
            else {
              var timeEntries = results.timeEntries;
              var projects    = results.projects;
              var contractors = results.contractors;

              var mailTitle   = 'Daily Newsletter ' + DateFormatter.dateToString(date);
              var mailContent = '';

              mailContent += '<html>';
              mailContent += '<body>';
              mailContent += '<h1 style="font-size: 13pt; text-align: center;">';
              mailContent +=   '<font color="#253645" style="font-family: monospace; text-decoration: underline;">Freshbooks Reporter - Daily Newsletter</font>';
              mailContent += '</h1>';
              mailContent += '<h2 style="font-size: 11pt; margin-top: 20px; text-align: center;">';
              mailContent +=   '<font color="#253645" style="font-family: monospace;">Team Time Entries for:&nbsp;</font>';
              mailContent +=   '<font color="#F1658C" style="font-family: monospace;">' + DateFormatter.dateToString(date) + '</font>';
              mailContent += '</h2>';

              mailContent += '<table style="border-collapse: collapse; margin-top: 25px; width: 100%;">';

              if (timeEntries.length == 0) {
                mailContent += '<tr>';
                mailContent +=   '<td colspan="2" style="vertical-align: middle;">';
                mailContent +=     '<hr/>';
                mailContent +=     '<font color="#A0A0A0" style="font-size: 9pt; font-family: monospace;">No time entries found :(</font>';
                mailContent +=     '<hr/>';
                mailContent +=   '</td>';
                mailContent += '</tr>';
              }
              else {
                //titles
                mailContent += '<tr>';
                mailContent +=   '<td style="padding: 8px;">';
                mailContent +=     '<font color="#A0A0A0" style="font-size: 9pt; font-family: monospace;">Contractor > Project > Notes</font>';
                mailContent +=   '</td>';
                mailContent +=   '<td style="padding: 8px;" align="right">';
                mailContent +=      '<font color="#A0A0A0" style="font-size: 9pt; font-family: monospace;">Hours</font>';
                mailContent +=   '</td>';
                mailContent += '</tr>';

                var staffGroup = _.groupBy(timeEntries, function(te) {
                  return te.staff_id;
                });

                _.each(staffGroup, function(staff_te, staff_id) {
                  var staff       = _.find(contractors, function(con) { return con.staff_id == staff_id; });
                  var staffTotal  = _.reduce(staff_te, function(total, te) { return total + (te.hours || 0); }, 0);

                  //contractor
                  mailContent += '<tr bgcolor="#253645">';
                  mailContent +=   '<td style="padding: 8px;">';
                  mailContent +=     '<font color="#FFFFFF" style="font-size: 9pt; font-family: monospace;">' + staff.first_name.toUpperCase() + ' ' + staff.last_name.toUpperCase() + '</font>';
                  mailContent +=   '</td>';
                  mailContent +=   '<td style="padding: 8px;" align="right">';
                  mailContent +=     '<font color="#FFFFFF" style="font-size: 9pt; font-family: monospace;">' + staffTotal.toFixed(2) + '</font>';
                  mailContent +=   '</td>';
                  mailContent += '</tr>';

                  var projectsGroup = _.groupBy(staff_te, function(te) {
                    return te.project_id;
                  });

                  _.each(projectsGroup, function(project_te, project_id) {
                    var project      = _.find(projects, function(pro) { return pro.project_id == project_id; });
                    var projectTotal = _.reduce(project_te, function(total, te) { return total + (te.hours || 0); }, 0);

                    //project
                    mailContent += '<tr bgcolor="#F1658C">';
                    mailContent +=   '<td style="padding: 8px;">';
                    mailContent +=     '<font color="#FFFFFF" style="font-size: 9pt; font-family: monospace;">' + project.name.toUpperCase() + '</font>';
                    mailContent +=   '</td>';
                    mailContent +=   '<td style="padding: 8px;" align="right">';
                    mailContent +=     '<font color="#FFFFFF" style="font-size: 9pt; font-family: monospace;">' + projectTotal.toFixed(2) + '</font>';
                    mailContent +=   '</td>';
                    mailContent += '</tr>';

                    var i = 0;

                    _.each(project_te, function(te) {
                      var color = (i % 2 == 0 ? 'E8E8E8' : 'FFFFFF');

                      //time entry
                      mailContent += '<tr bgcolor="#F8F8FF" style="border-bottom: 1px solid #F1658C;">';
                      mailContent +=   '<td style="padding: 8px; text-align: justify;">';
                      mailContent +=     '<font style="font-size: 8pt; font-family: monospace;">' + (te.notes && te.notes.trim() != '' ? te.notes.trim() : '-') + '</font>';
                      mailContent +=   '</td>';
                      mailContent +=   '<td style="padding: 8px;" align="right">';
                      mailContent +=     '<font style="font-size: 8pt; font-family: monospace;">' + te.hours.toFixed(2) + '</font>';
                      mailContent +=   '</td>';
                      mailContent += '</tr>';

                      i++;
                    });
                  });

                  //separator
                  mailContent += '<tr height="15px">';
                  mailContent +=   '<td colspan="2"></td>';
                  mailContent += '</tr>';
                });
              }

              //signature
              mailContent += '<tr height="40px" align="center">';
              mailContent +=   '<td colspan="2" style="vertical-align: middle;">';
              mailContent +=     '<a href="https://getmoxied.net/">';
              mailContent +=       '<font color="#A0A0A0" style="font-size: 7pt; font-family: monospace;">Powered by Moxie Media Group, Inc.</font>';
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
