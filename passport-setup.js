const passport =require('passport'),
    LocalStrategy = require('passport-local'),
    WsFedSaml2Strategy = require('passport-wsfed-saml2').Strategy,
    Auth0Login = require('./auth0Login');

passport.serializeUser( (user,done)=> {
  done(null,user);
});

passport.deserializeUser( (user,done) =>{
  done(null,user);
});

var local = new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password',
  session: true
},function(username,password,done){
  new Auth0Login()
  .login(username,password,function(err,profile){
    if (err) {
        console.log(err);
        return done(null,null);
    }
    done(null,profile);
  });
});
passport.use(local);

const saml2 = new WsFedSaml2Strategy({
    protocol: 'samlp',
    path: '/profile',
    realm: 'urn:pkr.auth0.com',
    session: true,
    identityProviderUrl: 'https://pkr.auth0.com/samlp/1wdVlMJc3FoS2qkaP8ryqm5E1uRviEMe?connection=aa',
    thumbprints: ['66C404F88825AA3A9E71387C27C7F60EBBF791D0']
}, function(profile, done){
  console.log('dong');
  console.log(profile);
  done(null,profile);
});

passport.use(saml2);