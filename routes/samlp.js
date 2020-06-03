const router = require("express").Router(),
  debug = require("debug")("wsfed-samlp"),
  passport = require("passport");

const FLASH_TYPE = "passport-error";
router.get("/", (req, res, next) => {
  const error = req.flash(FLASH_TYPE);
  if (error) {
    debug("Faiedl with error: %O", error);
    req.flash();
  }

  debug(
    "Starting samlp login with ReturnTo: %s",
    req.query ? req.query.ReturnTo : ""
  );
  passport.authenticate("wsfed-saml2", { RelayState: req.query.ReturnTo })(
    req,
    res,
    next
  );
});

router.post(
  "/callback",
  (req, res, next) => {
    debug("Processing saml response...");
    //TODO: proper state verification
    req.session.returnTo = req.body.RelayState;
    next();
  },
  passport.authenticate("wsfed-saml2", {
    failureRedirect: "/",
    failureFlash: { type: FLASH_TYPE },
    successReturnToOrRedirect: "/profile",
  }),
  (req, res, next) => {
    const e = req.flash("passport-error");
    debug("Failed with error: %o", e);
    next();
  }
);

module.exports = router;
