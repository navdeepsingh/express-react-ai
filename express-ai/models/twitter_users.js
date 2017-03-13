var mongoose = require('mongoose');

var Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

var TwitterUser = new Schema({
      user_id    : ObjectId,
      twitter_id     : String,
      token      : String,
      body      : String,
      date      : Date
  });

var TwitterUser = mongoose.model('TwitterUser', TwitterUser);
module.exports = TwitterUser;
