'use strict';

var express = require('express')
var router = express.Router();
var passport = require('passport');
var passportJWT = require("passport-jwt");
var jwt = require('jsonwebtoken');
var config = require('../config/auth');

const TwitterUserModel = require('../models/twitter_users');
let options = {
        maxAge: 1000 * 60 * 60, // would expire after 60 minutes
    }


router.get('/', passport.authenticate('twitter'));
router.get('/callback',
  passport.authenticate('twitter', { failureRedirect: '/login' }),
  function(req, res) {
    var payload = {id: req.user.id};
    var token = jwt.sign(payload, config.jwt.SECRET_OR_KEY);
    res.cookie('token', token, options);

    let TwitterUser = new TwitterUserModel();
    TwitterUser.twitter_id = req.user.id;
    TwitterUser.token = token;
    TwitterUser.save((err) => {
      console.error(err);
    });

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
          return res.json({message: "Success! You can not see this without a token",token : token, decoded : decoded, valid : user});
        })
        .catch((err) => {
          console.error(err);
        });
    } else {
      return res.send();
    }

    //return res.json();

});

module.exports = router;
