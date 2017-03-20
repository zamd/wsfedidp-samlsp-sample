var express = require('express');
var router = express.Router();
var passport = require('passport');

router.get('/', function(req, res, next) {
    res.render('login', { title: 'Express' });
});

router.post('/', 
passport.authenticate('local', { failureRedirect: '/login', successReturnToOrRedirect: '/profile' }));

module.exports = router;
