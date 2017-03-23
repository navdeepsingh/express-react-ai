var mongoose = require('mongoose')
  , Schema = mongoose.Schema
  , ObjectId = Schema.ObjectId
  , findOrCreate = require('mongoose-findorcreate');

var Schema = new Schema({
      user_id    : ObjectId,
      facebook_id     : Number,
      username      : String,
      name      : String,
      token     : String,
      dateAdded: {type: Date, default: Date.now},
      dateUpdated: {type: Date}
  });
Schema.plugin(findOrCreate);

var FacebookUser = mongoose.model('FacebookUser', Schema);

module.exports = {
  Model : FacebookUser,
  Schema : Schema
}
