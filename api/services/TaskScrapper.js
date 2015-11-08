/**
 * TaskScrapper.js
 *
 * @description :: Task Scrapper
 * @docs        :: http://sailsjs.org/#!documentation/services
 */

var q = require('q');

module.exports = {

  startScrapping: function(options) {
    var _this = this;
    var dfd   = q.defer();

    //get all different task ids from time entries
    TimeEntry.native(function(err, collection) {
      collection.distinct('task_id', function(err, tasks) {
        async.eachSeries(tasks, function(task_id, callback) {
          Task.findOne({task_id: task_id}).exec(function(err, tsk) {
            if (err) 
              callback(err);
            else if (!tsk) {
              //task does not exists yet -> scrap and create task
              _this._scapTask(task_id, function(task){
                if (!task)
                  callback(null);
                else {
                  Task.create(task).exec(function(err, res) {
                    callback(err);
                  });
                }
              });
            }
            else {
              //task already exists -> check if there are related time entries in the last month
              var date     = new Date();
              var todayInt = DateFormatter.stringToIntegerDate(DateFormatter.dateToString(date));

              var aMonthAgo = new Date();
              aMonthAgo.setMonth(aMonthAgo.getMonth() - 1);
              var aMonthAgoInt = DateFormatter.stringToIntegerDate(DateFormatter.dateToString(aMonthAgo));

              TimeEntry.findOne({task_id: task_id, date: {'>=': aMonthAgoInt, '<': todayInt}}).exec(function(err, te){
                if (err || !te) 
                  callback(err);
                else {
                  //scrap and update task
                  _this._scapTask(task_id, function(task){
                    if (!task)
                      callback(null);
                    else {
                      Task.update({task_id: task_id}, task).exec(function(err, res) {
                        callback(err);
                      });
                    }
                  });
                }
              });
            }
          });
        }, function(err){
          if (err) console.log(err);
          dfd.resolve(true);
        });
      });
    });

    return dfd.promise;
  },

  _scapTask: function(task_id, callback) {
    console.log('Scrapping Task: ' + task_id);

    Freshbooks.api().call('task.get', {task_id: task_id}, function(err, response) {
      if (err || !response.response.task)
        callback(null);
      else {
        var task       = response.response.task;
        var attributes = ['task_id', 'name', 'description'];
        var theTask    = _.pick(task, attributes);

        callback(theTask);
      }
    });
  }

};
