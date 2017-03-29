var jwt = require('jsonwebtoken');
var Promise = require('bluebird');
const TwitterUser = require('../models/twitter_users');
const TwitterUserModel = TwitterUser.Model;
const FacebookUser = require('../models/facebook_users');
const FacebookUserModel = FacebookUser.Model;

module.exports = function() {
  return function(req, res, next) {
    // Implement the middleware function
    console.log('<== Auth Middlware Fired ==>');
    if (req.query.token || req.query.token !== '|') {
      const [twToken, fbToken] = req.query.token.split('|');

      let twDecoded = jwt.decode(twToken, {complete: true});
      let fbDecoded = jwt.decode(fbToken, {complete: true});

      var execution = Promise.coroutine(function* (){
        if (twDecoded) {
          let twPromise = TwitterUserModel.findOne({twitter_id: twDecoded.payload.id}).exec();
          let twitterUser =  yield twPromise;
          req.twitterUser = twitterUser;
        }

        if (fbDecoded) {
          let fbPromise = FacebookUserModel.findOne({facebook_id: fbDecoded.payload.id}).exec();
          let facebookUser =  yield fbPromise;
          req.facebookUser = facebookUser;
        }
        next();
      })();

    } else {
      res.send('You are not authorised to proceed. It\'s Middlware.');
    }
  }
}
