var mongoose = require('mongoose')
  , TwitterUser = require('./twitter_users')
  , Schema = mongoose.Schema
  , ObjectId = Schema.ObjectId
  , TwitterUserSchema = TwitterUser.Schema;

var Schema = new Schema({
      id    : ObjectId,
      user_id     : { type: ObjectId, ref: 'TwitterUserSchema' },
      feed      : String,
      analysis      : String,
      dateAdded: {type: Date, default: Date.now},
      dateUpdated: {type: Date}
  });

var TwitterFeeds = mongoose.model('TwitterFeeds', Schema);

module.exports = TwitterFeeds;
