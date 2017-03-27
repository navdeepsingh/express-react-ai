'use strict';

var express = require('express')
var router = express.Router();
var controller = require('./controllers');


router.get('/', controller.main);
router.get('/view-feeds', controller.viewFeeds);

module.exports = router;
