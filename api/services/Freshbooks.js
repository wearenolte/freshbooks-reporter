/**
 * Freshbooks.js
 *
 * @description :: Freshbooks Wrapper
 * @docs        :: http://sailsjs.org/#!documentation/services
 */

var FreshbooksApi = require("freshbooks-node");
var connection = new FreshbooksApi(
  sails.config.freshbooks.login, sails.config.freshbooks.apiKey, sails.config.freshbooks.appName
);

module.exports = {
  api: connection
};
