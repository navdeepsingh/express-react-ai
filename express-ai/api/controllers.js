'use strict';

const TwitterFeedsModel = require('../models/twitter_feeds');
const FacebookFeedsModel = require('../models/facebook_feeds');
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
       //console.log(req.twitterUser, req.facebookUser);
       let twitterFeeds = 0;
       let facebookFeeds = 0;
       // Genrator is being used
       var execution = Promise.coroutine(function* (){
          if (req.twitterUser) {
           let promiseA = TwitterFeedsModel.count({user_id : req.twitterUser._id}).exec();
           let twitterFeedsResult =  yield promiseA;
           if (twitterFeedsResult)
            twitterFeeds = 1;
          }
          if (req.facebookUser) {
           let promiseB = FacebookFeedsModel.count({user_id : req.facebookUser._id}).exec();
           let facebookFeedsResult =  yield promiseB;
           if (facebookFeedsResult)
            facebookFeeds = 1;
          }
          res.send({
             message : 'Phew! You reached here with valid token',
             twitterUser: req.twitterUser,
             facebookUser: req.facebookUser,
             twitterFeeds,
             facebookFeeds
           });
       })();
  }
  else {
    res.send('You are not authorised to proceed.Thanks!');
  }
}

exports.viewFeeds = function (req, res) {
  if ( req.twitterUser && req.facebookUser ) {
       let promiseA = TwitterFeedsModel.find({user_id : req.twitterUser._id}).exec();
       let promiseB = FacebookFeedsModel.find({user_id : req.facebookUser._id}).exec();

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
  if ( req.twitterUser && req.facebookUser ) {

    let promiseA = TwitterFeedsModel.find({user_id : req.twitterUser._id}).exec();
    let promiseB = FacebookFeedsModel.find({user_id : req.facebookUser._id}).exec();

    // Genrator is being used
    var execution = Promise.coroutine(function* (){
       let twitterFeeds =  yield promiseA;
       let facebookFeeds =  yield promiseB;

      /* const socialFeeds = [twitterFeeds, facebookFeeds];
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
                  return false;
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
       });*/
       twitterFeeds = twitterFeeds.filter(tweet => tweet.analysis !== undefined)
                   .map((tweet, i) => {
                     tweet.analysis.feed = tweet.feed;
                     tweet.analysis.index = i+1;
                     return tweet.analysis;
                   });
       facebookFeeds = facebookFeeds.filter(post => post.analysis !== undefined)
                     .map((post, i) => {
                       post.analysis.feed = post.feed;
                       post.analysis.index = i+1;
                       return post.analysis;
                     });
       res.send({twitterFeeds, facebookFeeds});
    })();
  }
  else {
    res.send('You are not authrised to proceed.Thanks!');
  }

}
