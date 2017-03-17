'use strict';

var express = require('express')
  , router = express.Router()
  , passport = require('passport')
  , passportJWT = require("passport-jwt")
  , FacebookStrategy = require('passport-facebook').Strategy
  , jwt = require('jsonwebtoken')
  , config = require('../config');

const FacebookUserModel = require('../models/facebook_users');


passport.use(new FacebookStrategy({
    clientID: config.facebook.APP_ID,
    clientSecret: config.facebook.APP_SECRET,
    callbackURL: config.facebook.CALLBACK_URL
  },
  function(accessToken, refreshToken, profile, done) {
    return done(null, profile);
  }));

router.get('/', passport.authenticate('facebook'));
router.get('/callback',
  passport.authenticate('facebook', { failureRedirect: '/login' }),
  function(req, res) {
    var payload = {id: req.user.id};
    var token = jwt.sign(payload, config.jwt.SECRET_OR_KEY);
    res.cookie('token', token, config.jwt.options);
    res.json(req.user);

    FacebookUserModel.findOrCreate({'facebook_id': req.user.id, 'name': req.user.displayName}, function(err, user){
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
      var query = FacebookUserModel.findOne({facebook_id: decoded.payload.id});
      var promise = query.exec();
      promise
        .then((user) => {
          console.log(user);
          return user;
        })
        .then((user)=>{
          return res.json({message: "Success! You can not see this without a token",token : token, decoded : decoded, valid : user});
        })
        .catch((err) => {
          console.error(err);
        });
    } else {
      return res.send();
    }
});

module.exports = router;
