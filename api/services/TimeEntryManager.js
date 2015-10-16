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
              mailContent += '<head>';
              mailContent += '<style>';
              mailContent += 'table { border-collapse: collapse; }';
              mailContent += 'td { padding: 8px; }';
              mailContent += '</style>';
              mailContent += '</head>';
              mailContent += '<body>';
              mailContent += '<h2>Freshbooks Reporter - Daily Newsletter</h2>';
              mailContent += '<h3>Team Time Entries for <font color="#FF5157">' + DateFormatter.dateToString(date) + '</font></h3>';
              mailContent += '<br/>';

              if (timeEntries.length == 0)
                mailContent += '<span>No time entries found</span>';
              else {
                mailContent += '<table>';
                mailContent += '<tr>';
                mailContent += '<td width="100px"><font color="#A0A0A0">Contractor</font></td>';
                mailContent += '<td width="100px"><font color="#A0A0A0">Project</font></td>';
                mailContent += '<td><font color="#A0A0A0">Notes</font></td>';
                mailContent += '<td align="right"><font color="#A0A0A0">Hours</font></td>';
                mailContent += '</tr>';

                var staffGroup = _.groupBy(timeEntries, function(te) {
                  return te.staff_id;
                });

                _.each(staffGroup, function(staff_te, staff_id) {
                  var staff       = _.find(contractors, function(con) { return con.staff_id == staff_id; });
                  var staffTotal  = _.reduce(staff_te, function(total, te) { return total + (te.hours || 0); }, 0);

                  mailContent += '<tr bgcolor="#2c3e50">';
                  mailContent += '<td colspan="3"><font color="#FFFFFF">' + staff.first_name + ' ' + staff.last_name + '</font></td>';
                  mailContent += '<td align="right"><font color="#FFFFFF">' + staffTotal.toFixed(2) + '</font></td>';
                  mailContent += '</tr>';

                  var projectsGroup = _.groupBy(staff_te, function(te) {
                    return te.project_id;
                  });

                  _.each(projectsGroup, function(project_te, project_id) {
                    var project      = _.find(projects, function(pro) { return pro.project_id == project_id; });
                    var projectTotal = _.reduce(project_te, function(total, te) { return total + (te.hours || 0); }, 0);

                    mailContent += '<tr>';
                    mailContent += '<td></td>';
                    mailContent += '<td colspan="2" bgcolor="#18bc9c"><font color="#FFFFFF">' + project.name + '</font></td>';
                    mailContent += '<td align="right" bgcolor="#18bc9c"><font color="#FFFFFF">' + projectTotal.toFixed(2) + '</font></td>';
                    mailContent += '</tr>';

                    var i = 0;

                    _.each(project_te, function(te) {
                      var color = (i % 2 == 0 ? 'E8E8E8' : 'FFFFFF');

                      mailContent += '<tr>';
                      mailContent += '<td></td>';
                      mailContent += '<td></td>';
                      mailContent += '<td bgcolor="#' + color + '">' + (te.notes && te.notes.trim() != '' ? te.notes.trim() : '-') + '</td>';
                      mailContent += '<td bgcolor="#' + color + '" align="right">' + te.hours.toFixed(2) + '</td>';
                      mailContent += '</tr>';

                      i++;
                    });
                  });

                  mailContent += '<tr height="5px">';
                  mailContent += '<td colspan="4"></td>';
                  mailContent += '</tr>';
                });

                mailContent += '</table>';
                mailContent += '<br/>';
              }

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
