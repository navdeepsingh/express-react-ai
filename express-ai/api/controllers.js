'use strict';

const TwitterFeedsModel = require('../models/twitter_feeds');
const FacebookFeedsModel = require('../models/facebook_feeds');
var jwt = require('jsonwebtoken');
var Promise = require('bluebird');

exports.main = function (req, res) {
  res.send('Hello from controller');
}

exports.viewFeeds = function (req, res) {
  if (req.query.token) {
    const [twToken, fbToken] = req.query.token.split('|');
    let twDecoded = jwt.decode(twToken, {complete: true});
    let fbDecoded = jwt.decode(fbToken, {complete: true});

    if (twDecoded && fbDecoded) {
       let promiseA = TwitterFeedsModel.find({}).exec();
       let promiseB = FacebookFeedsModel.find({}).exec();

       // Genrator is being used
       var execution = Promise.coroutine(function* (){
          let resultA =  yield promiseA;
          let resultB =  yield promiseB;

          res.send({twitterFeeds : resultA, facebookFeeds : resultB});
       })();

    }
  }
  //res.send('Valid');
}
