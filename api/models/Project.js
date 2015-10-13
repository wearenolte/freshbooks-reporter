/**
* Project.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {
    project_id: {
      type: 'integer',
      required: true
    },

    name: {
      type: 'string'
    },

    description: {
      type: 'string'
    },

    client_id: {
      type: 'integer'
    },

    budget_hours: {
      type: 'float'
    },

    staff: {
      type: 'json'
    }
  }
};

