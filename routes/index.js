var express = require('express');
var router = express.Router();
var pass = require('./pass');
var profile = require('./profile');

/* GET home page. */
router.post('/downloadpass', profile.get,pass.generate)
// router.get('/', profile.get,pass.generate) //TEST

module.exports = router;