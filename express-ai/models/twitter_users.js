var mongoose = require('mongoose')
  , Schema = mongoose.Schema
  , ObjectId = Schema.ObjectId
  , findOrCreate = require('mongoose-findorcreate');

var Schema = new Schema({
      user_id    : ObjectId,
      twitter_id     : String,
      username      : String,
      name      : String,
      photos    : Array,
      token     : String,
      tokenSecret    : String,
      dateAdded: {type: Date, default: Date.now},
      dateUpdated: {type: Date}
  });
Schema.plugin(findOrCreate);

var TwitterUser = mongoose.model('TwitterUser', Schema);

module.exports = {
  Model : TwitterUser,
  Schema : Schema
}
