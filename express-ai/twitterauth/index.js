'use strict';

var express = require('express')
var router = express.Router();
var passport = require('passport');
var passportJWT = require("passport-jwt");
var TwitterStrategy = require('passport-twitter').Strategy;
var jwt = require('jsonwebtoken');
var config = require('../config');

const TwitterUserModel = require('../models/twitter_users');

passport.use(new TwitterStrategy({
    consumerKey: config.twitter.CONSUMER_KEY,
    consumerSecret: config.twitter.CONSUMER_SECRET,
    callbackURL: config.twitter.CALLBACK_URL
  },
  function(token, tokenSecret, profile, cb) {
    return cb(null, profile);
  }));

router.get('/', passport.authenticate('twitter'));
router.get('/callback',
  passport.authenticate('twitter', { failureRedirect: '/login' }),
  function(req, res) {
    var payload = {id: req.user.id};
    var token = jwt.sign(payload, config.jwt.SECRET_OR_KEY);
    res.cookie('twitterToken', token, config.jwt.options);

    //res.json(req.user);

    TwitterUserModel.findOrCreate({
        'twitter_id': req.user.id,
        'username': req.user.username,
        'name': req.user.displayName,
        'photos': req.user.photos
      }, function(err, user){
      if (err) console.error(err);
      console.log(user);
    })

    res.redirect('http://localhost:3000/after-auth');
  }
);
router.get('/jwt',
  function(req, res){
    const token = req.query.token;
    var decoded = jwt.decode(token, {complete: true});
    let valid = false;

    if (decoded) {
      var query = TwitterUserModel.findOne({twitter_id: decoded.payload.id});
      var promise = query.exec();
      promise
        .then((user) => {
          console.log(user);
          return user;
        })
        .then((user)=>{
          return res.json({message: "Success! You can not see this without a token",token : token, decoded : decoded, user : user});
        })
        .catch((err) => {
          console.error(err);
        });
    } else {
      return res.send();
    }
});

module.exports = router;
