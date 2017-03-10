'use strict';

var express = require('express')
var router = express.Router();
var passport = require('passport');
var passportJWT = require("passport-jwt");
var jwt = require('jsonwebtoken');
var config = require('../config/auth');
let options = {
        maxAge: 1000 * 60 * 60, // would expire after 60 minutes
    }


router.get('/', passport.authenticate('twitter'));
router.get('/callback',
  passport.authenticate('twitter', { failureRedirect: '/login' }),
  function(req, res) {
    var payload = {id: req.user.id};
    var token = jwt.sign(payload, config.jwt.SECRET_OR_KEY);
    res.set("Authorization", "JWT " + token);
    //res.headers.authorization = "JWT " + token;
    res.cookie('token', token, options);
    //res.json({message: "ok", token: token, user_id : req.user.id, session_token : req.cookies});
    res.redirect('http://localhost:3000/');
    // this is testddddd
  }
);
router.get('/jwt',
  function(req, res){
    var decoded = jwt.decode(req.cookies.token, {complete: true});
    return res.json({message: "Success! You can not see this without a token",token : req.cookies.token});
});

module.exports = router;
