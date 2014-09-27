/**
* TimeEntry.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {
    time_entry_id: {
      type: 'integer',
      required: true
    },

    staff_id: {
      type: 'integer'
    },

    project_id: {
      type: 'integer'
    },

    hours: {
      type: 'float'
    },

    date: {
      type: 'date'
    },

    notes: {
      type: 'string'
    }
  }
};

