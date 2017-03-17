var mongoose = require('mongoose')
  , Schema = mongoose.Schema
  , ObjectId = Schema.ObjectId
  , findOrCreate = require('mongoose-findorcreate');

var Schema = new Schema({
      user_id    : ObjectId,
      facebook_id     : Number,
      name      : String,
      token      : String,
      dateAdded: {type: Date, default: Date.now}
  });
Schema.plugin(findOrCreate);

var FacebookUser = mongoose.model('FacebookUser', Schema);
module.exports = FacebookUser;
