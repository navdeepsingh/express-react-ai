'use strict';

var express = require('express')
  , router = express.Router()
  , passport = require('passport')
  , passportJWT = require("passport-jwt")
  , FacebookStrategy = require('passport-facebook').Strategy
  , jwt = require('jsonwebtoken')
  , config = require('../config')
  , Promise = require('bluebird')
  , Facebook = require('facebook-node-sdk');;

const facebook = new Facebook({ appID: config.facebook.APP_ID, secret: config.facebook.APP_SECRET });
const FacebookUser = require('../models/facebook_users');
const FacebookUserModel = FacebookUser.Model;
const FacebookFeedsModel = require('../models/facebook_feeds');


passport.use(new FacebookStrategy({
    clientID: config.facebook.APP_ID,
    clientSecret: config.facebook.APP_SECRET,
    callbackURL: config.facebook.CALLBACK_URL
  },
  function(accessToken, refreshToken, profile, done) {

    const query = FacebookUserModel.findOne({'facebook_id': profile.id});
    const promise = query.exec();
    promise
      .then(user=>{
        if (user) {
          user.dateUpdated = new Date()
          user.token = accessToken;
          return user.save();
        } else {
          FacebookUserModel.create({
            'facebook_id': profile.id,
            'username': profile.username,
            'name': profile.displayName,
            'dateUpdated': new Date(),
            'token': accessToken,
          }, function(err, user){
            if (err) console.error(err);
            console.log('User Added' + user);
          })
        }
      })
      .catch((err) => {
        console.error(err);
      });

    return done(null, profile);
  }));

router.get('/', passport.authenticate('facebook'));
router.get('/callback',
  passport.authenticate('facebook', { failureRedirect: '/login' }),
  function(req, res) {
    var payload = {id: req.user.id};
    var token = jwt.sign(payload, config.jwt.SECRET_OR_KEY);
    res.cookie('facebookToken', token, config.jwt.options);
    res.redirect('http://localhost:3000/after-auth');
  }
);
router.get('/jwt',
  function(req, res){
    const token = req.query.token;
    var decoded = jwt.decode(token, {complete: true});
    let valid = false;

    if (decoded) {
      var query = FacebookUserModel.findOne({facebook_id: decoded.payload.id});
      var promise = query.exec();
      // Genrator is being used
      var execution = Promise.coroutine(function* (){
        let resultA = yield promise;
        let resultB = yield FacebookFeedsModel.findOne({user_id: resultA._id}).exec();
        return res.send({message: "Success! You can not see this without a token",token : token, decoded : decoded, user : resultA, feed: resultB});
      })(); // IIFE - Immidiaetely Invoked Function Expression is used

    } else {
      return res.send('You are not authorised to proceed.');
    }
});

router.get('/feed',
  function(req, res){
    const token = req.query.token;
    var decoded = jwt.decode(token, {complete: true});
    if (decoded) {
      var query = FacebookUserModel.findOne({facebook_id: decoded.payload.id});
      var promise = query.exec();
      promise
        .then(user => {
          facebook.api('/me/feed', {access_token : user.token}, function(err, result) {
            if (err) console.error(err);

            FacebookFeedsModel.remove({user_id : user._id},err => {
              if (err) console.error(err);
            })

            // ES6 filter method used for filtering
            const filteredData = result.data.filter(post => post.message !== undefined)
                                            .map(post => post.message);
            filteredData.map(post => {
              FacebookFeedsModel.create({user_id : user._id, feed: post }, function(err, feed){
                if (err) console.error(err);
                console.log(feed);
              });
            })
            return res.send({message : 'Pull Done'});
          });
        })
        .catch(err => {
          console.error(err);
          return;
        });

    } else {
      return res.send('You are not authorised to proceed.');
    }
  }
);

module.exports = router;
