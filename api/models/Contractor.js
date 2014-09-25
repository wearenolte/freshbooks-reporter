/**
* Contractor.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {
    staff_id: {
      type: 'string',
      required: true
    },

    first_name: {
      type: 'string'
    },

    last_name: {
      type: 'string'
    },

    email: {
      type: 'string'
    }
  }
};

