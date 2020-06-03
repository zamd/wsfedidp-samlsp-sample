const router = require("express").Router();

router.get("/", function (req, res, next) {
  res.render("index", { title: "SAML SP" });
});

module.exports = router;
