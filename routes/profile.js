var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  res.render('profile', {title: 'Profile management', user: req.user.name || req.user.email });
});

module.exports = router;
