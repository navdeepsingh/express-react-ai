var express = require('express');
var bodyParser = require("body-parser");
var app = express();
var config = require('./config');
var passport = require('passport');
var cookieParser = require('cookie-parser');
var cors = require('./config/cors');
var auth = require('./middleware/auth');

var mongoose = require('mongoose');
mongoose.connect(config.dbUrl);

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
app.use('/auth/facebook', log, require('./facebookauth'));
app.use('/api', log, auth(), require('./api'));


function log(req, res, next) {
  console.log(new Date(), req.method, req.url)
  next();
}

app.listen(config.port, ()=> {
  console.log(`Server started at ${config.port}`);
})
