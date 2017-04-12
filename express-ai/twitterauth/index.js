'use strict';

var express = require('express')
var router = express.Router();
var Promise = require("bluebird");
var passport = require('passport');
var passportJWT = require("passport-jwt");
var TwitterStrategy = require('passport-twitter').Strategy;
var jwt = require('jsonwebtoken');
var config = require('../config');
var twitterAPI = require('node-twitter-api');
const promisify = require("es6-promisify");
const twitter = new twitterAPI({
          consumerKey: config.twitter.CONSUMER_KEY,
          consumerSecret: config.twitter.CONSUMER_SECRET
      });

const TwitterUser = require('../models/twitter_users');
const TwitterUserModel = TwitterUser.Model;
const TwitterFeedsModel = require('../models/twitter_feeds');

passport.use(new TwitterStrategy({
    consumerKey: config.twitter.CONSUMER_KEY,
    consumerSecret: config.twitter.CONSUMER_SECRET,
    callbackURL: config.twitter.CALLBACK_URL
  },
  function(token, tokenSecret, profile, cb) {
    console.log('Testing from init');

    const query = TwitterUserModel.findOne({'twitter_id': profile.id});
    const promise = query.exec();
    promise
      .then(user=>{
        if (user) {
          user.dateUpdated = new Date()
          user.token = token;
          user.tokenSecret = tokenSecret;
          return user.save();
        } else {
          TwitterUserModel.create({
            'twitter_id': profile.id,
            'username': profile.username,
            'name': profile.displayName,
            'photos': profile.photos,
            'dateUpdated': new Date(),
            'token': token,
            'tokenSecret': tokenSecret
          }, function(err, user){
            if (err) console.error(err);
            console.log('User Added' + user);
          })
        }
      })
      .catch((err) => {
        console.error(err);
      });

    return cb(null, profile);
  }));

router.get('/', passport.authenticate('twitter'));
router.get('/callback',
  passport.authenticate('twitter', { failureRedirect: '/login' }),
  function(req, res) {
    var payload = {id: req.user.id};
    var token = jwt.sign(payload, config.jwt.SECRET_OR_KEY, {expiresIn: config.jwt.options.maxAge});
    res.cookie('twitterToken', token, config.jwt.options);
    res.redirect('http://localhost:3000/after-auth');
  }
);
router.get('/statuses/home_timeline',
  function(req, res){
    const token = req.query.token;
    var decoded = jwt.decode(token, {complete: true});
    if (decoded) {
      var query = TwitterUserModel.findOne({twitter_id: decoded.payload.id});
      var promise = query.exec();
      const getTimeline = promisify( twitter.getTimeline.bind( twitter ), {multiArgs: true} );

      // Genrator is being used
      var execution = Promise.coroutine(function* (){
        let resultA = yield promise;
        let resultB = yield getTimeline("home_timeline", '', resultA.token, resultA.tokenSecret);

        TwitterFeedsModel.remove({user_id : resultA._id},err => {
          if (err) console.error(err);
        })

        for(let obj of resultB[0]) {
            TwitterFeedsModel.create({user_id : resultA._id, feed: obj.text }, function(err, feed){
              if (err) console.error(err);
            })
        }
        return res.send({message : 'Pull Done', twitterFeeds: 1});
      })(); // IIFE - Immidiaetely Invoked Function Expression is used

    } else {
      return res.send('You are not authorised to proceed.');
    }
  }
);

module.exports = router;
