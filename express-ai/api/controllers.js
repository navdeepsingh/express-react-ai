'use strict';

const TwitterUser = require('../models/twitter_users');
const TwitterUserModel = TwitterUser.Model;
const TwitterFeedsModel = require('../models/twitter_feeds');
const FacebookUser = require('../models/facebook_users');
const FacebookUserModel = FacebookUser.Model;
const FacebookFeedsModel = require('../models/facebook_feeds');
var jwt = require('jsonwebtoken');
var Promise = require('bluebird');
const config = require('../config');
var NaturalLanguageUnderstandingV1 = require('watson-developer-cloud/natural-language-understanding/v1.js');
var nlu = new NaturalLanguageUnderstandingV1({
  'username': config.alchemyapi.username,
  'password': config.alchemyapi.password,
  'version_date': NaturalLanguageUnderstandingV1.VERSION_DATE_2017_02_27
});

exports.main = function (req, res) {
  res.send('Hello from controller');
}

exports.auth = function (req, res) {
  if ( req.twitterUser || req.facebookUser ) {
       /*let twitterUserPromise = TwitterUserModel.findOne({twitter_id : req.twitter_id}).exec();
       let facebookUserPromise = FacebookUserModel.findOne({facebook_id : req.facebook_id}).exec();

       var execution = Promise.coroutine(function* (){
          let twitterUser =  yield twitterUserPromise;
          let facebookUser =  yield facebookUserPromise;
          res.send({message : 'Phew! You reached here with valid token', twitterUser, facebookUser});
       })();*/
       console.log(req.twitterUser, req.facebookUser);
       res.send({message : 'Phew! You reached here with valid token', twitterUser: req.twitterUser, facebookUser: req.facebookUser});
  }
  else {
    res.send('You are not authorised to proceed.Thanks!');
  }
}

exports.viewFeeds = function (req, res) {
  if ( req.twitter_id && req.facebook_id ) {
       let promiseA = TwitterFeedsModel.find({user_id : req.twitter_id}).exec();
       let promiseB = FacebookFeedsModel.find({user_id : req.facebook_id}).exec();

       // Genrator is being used
       var execution = Promise.coroutine(function* (){
          let twitterFeeds =  yield promiseA;
          let facebookFeeds =  yield promiseB;
          res.send({twitterFeeds, facebookFeeds});
       })();
  }
  else {
    res.send('You are not authrised to proceed.Thanks!');
  }
}

exports.analyze = function (req, res) {
  if ( req.twitter_id && req.facebook_id ) {

    let promiseA = TwitterFeedsModel.find({user_id : req.twitter_id}).exec();
    let promiseB = FacebookFeedsModel.find({user_id : req.facebook_id}).exec();

    // Genrator is being used
    var execution = Promise.coroutine(function* (){
       let twitterFeeds =  yield promiseA;
       let facebookFeeds =  yield promiseB;

       const socialFeeds = [twitterFeeds, facebookFeeds];
       socialFeeds.map(feeder => {
         for(const feed of feeder) {
           //console.log(feed.feed);
           nlu.analyze({
             'html': feed.feed, // Buffer or String
             'features': {
               'sentiment': {}
             }
           }, function(err, response) {
                if (err) {
                  console.log('error:', err, feed.feed);
                } else {
                  console.log(JSON.stringify(response.sentiment.document, null, 2));
                  feed.analysis = response.sentiment.document;
                  feed.save(function(err){
                    if (!err) {
                      console.log(feed);
                    } else {
                      console.log("Error : Could not save");
                    }
                  });
                }
           });
         }
       });
    })();
    res.send('Saved');
}

}
