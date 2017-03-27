var jwt = require('jsonwebtoken');
var Promise = require('bluebird');
const TwitterUser = require('../models/twitter_users');
const TwitterUserModel = TwitterUser.Model;
const FacebookUser = require('../models/facebook_users');
const FacebookUserModel = FacebookUser.Model;

module.exports = function() {
  return function(req, res, next) {
    // Implement the middleware function based on the options object
    console.log('Implementing Middlware');
    if (req.query.token) {
      const [twToken, fbToken] = req.query.token.split('|');

      let twDecoded = jwt.decode(twToken, {complete: true});
      let fbDecoded = jwt.decode(fbToken, {complete: true});

      if (twDecoded && fbDecoded) {
        let twPromise = TwitterUserModel.findOne({twitter_id: twDecoded.payload.id}).exec();
        let fbPromise = FacebookUserModel.findOne({facebook_id: fbDecoded.payload.id}).exec();

        // Genrator is being used
        var execution = Promise.coroutine(function* (){
          var twResult = yield twPromise;
          var fbResult = yield twPromise;

          if (twResult && fbResult) {
            next();
          } else {
            res.send('You are not authorised to proceed');
          }
        })();

      } else {
        res.send('You are not authorised to proceed');
      }

    }

    //if ( req.headers.cookie.indexOf('twitterToken') !== -1 || req.headers.cookie.indexOf('facebookToken') !== -1 )
//      next()


  }
}
