var express = require('express');
var bodyParser = require("body-parser");
var app = express();
var port = 8080;
var passport = require('passport');
var passportJWT = require("passport-jwt");
var cookieParser = require('cookie-parser');
var TwitterStrategy = require('passport-twitter').Strategy;
var config = require('./config/auth');
var cors = require('./config/cors');

var ExtractJwt = passportJWT.ExtractJwt;
var JwtStrategy = passportJWT.Strategy;

passport.use(new TwitterStrategy({
    consumerKey: config.twitter.CONSUMER_KEY,
    consumerSecret: config.twitter.CONSUMER_SECRET,
    callbackURL: config.twitter.CALLBACK_URL
  },
  function(token, tokenSecret, profile, cb) {
    return cb(null, profile);
  }));

passport.serializeUser(function(user, cb) {
  cb(null, user);
});

passport.deserializeUser(function(obj, cb) {
  cb(null, obj);
});




app.use(require('express-session')({ secret: 'navsara', resave: true, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

// parse application/x-www-form-urlencoded
// for easier testing with Postman or plain HTML forms
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(cookieParser());
// parse application/json
app.use(bodyParser.json());
app.use(cors());

app.get("/", function(req, res) {
  res.json({message: "Express is up!"});
});

app.use('/auth/twitter', log, require('./twitterauth'));

function jwt(req, res, next) {
  passport.use(new JwtStrategy({
    jwtFromRequest : cookieExtractor,
    secretOrKey : config.jwt.SECRET_OR_KEY
  }, function(jwt_payload, next) {
    console.log('payload received', jwt_payload);
    res.json(jwt_payload);
  }));

  passport.initialize();
  next();
}

var cookieExtractor = function(req) {
    var token = null;
    if (req && req.cookies)
    {
        token = req.cookies['token'];
    }
    return token;
};

function log(req, res, next) {
  console.log(new Date(), req.method, req.url)
  next();
}

app.listen(port, ()=> {
  console.log(`Server started at ${port}`);
})
