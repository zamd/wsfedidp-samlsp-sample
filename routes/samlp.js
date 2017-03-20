var express = require('express');
var router = express.Router();
var passport = require('passport');

router.get('/', 
(req,res,next)=>{
    console.log(req.query.ReturnTo);
    passport.authenticate('wsfed-saml2',{RelayState: req.query.ReturnTo})(req,res,next);
});

router.post('/callback',
(req,res,next)=>{
    //TODO: proper state verification
    req.session.returnTo = req.body.RelayState;  
    next();        
},
passport.authenticate('wsfed-saml2',{ failureRedirect: '/', successReturnToOrRedirect: '/profile' }));

module.exports = router;
