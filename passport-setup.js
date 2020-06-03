const passport = require("passport"),
  debug = require("debug")("wsfed-samlp"),
  WsFedSaml2Strategy = require("passport-wsfed-saml2").Strategy;

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

const saml2 = new WsFedSaml2Strategy(
  {
    protocol: "samlp",
    path: "/profile",
    realm: "urn:pkr.auth0.com",
    session: true,
    identityProviderUrl: `https://${process.env.AUTH0_DOMAIN}/samlp/${process.env.CLIENT_ID}`,
    thumbprint: process.env.SIGNING_CERT_THUMBPRINT,
  },
  function (profile, done) {
    debug("Login completed with profile: %o", profile);
    done(null, profile);
  }
);

passport.use(saml2);
