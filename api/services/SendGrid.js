/**
 * SendGrid.js
 *
 * @description :: SendGrid Wrapper
 * @docs        :: http://sailsjs.org/#!documentation/services
 */

module.exports = {
  send: function(mail, callback) {
    var SendGrid = require("sendgrid")(sails.config.sendgrid.apiKey);
    
    SendGrid.send({
      to:       mail.to,
      from:     sails.config.sendgrid.fromEmail,
      fromname: sails.config.sendgrid.fromName,
      subject:  mail.subject,
      html:     mail.content
    }, function(err, json) {
      callback(err);
    });
  }
};
