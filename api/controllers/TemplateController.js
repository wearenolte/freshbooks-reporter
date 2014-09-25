/**
 * TemplateController
 *
 * @description :: Server-side logic for managing templates
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

var TemplateController = {
  find: function(req,res) {
    var tpl = req.url.replace("/templates", "");

    require('fs').readFile('assets/js/app/' + tpl,function (err, contents) {
      if (err){
        console.log(err);
        res.contentType('text/html');
        res.send('');
      }
      else {
        res.contentType('text/html');
        res.send(contents);
      }
    });
  }
};

module.exports = TemplateController;
