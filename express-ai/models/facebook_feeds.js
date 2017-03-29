var mongoose = require('mongoose')
  , FacebookUser = require('./facebook_users')
  , Schema = mongoose.Schema
  , ObjectId = Schema.ObjectId
  , FacebookUserSchema = FacebookUser.Schema;

var Schema = new Schema({
      user_id     : { type: ObjectId, ref: 'FacebookUserSchema' },
      feed      : String,
      analysis      : Object,
      dateAdded: {type: Date, default: Date.now},
      dateUpdated: {type: Date}
  });

var FacebookFeeds = mongoose.model('FacebookFeeds', Schema);

module.exports = FacebookFeeds;
