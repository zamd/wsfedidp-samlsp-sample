require("dotenv").config();

const express = require("express"),
  path = require("path"),
  favicon = require("serve-favicon"),
  flash = require("connect-flash"),
  logger = require("morgan"),
  cookieParser = require("cookie-parser"),
  bodyParser = require("body-parser"),
  session = require("express-session"),
  passport = require("passport"),
  ensureLoggedIn = require("connect-ensure-login").ensureLoggedIn;

require("./passport-setup");
const index = require("./routes/index"),
  profile = require("./routes/profile"),
  samlp = require("./routes/samlp");

const app = express();
app.use(flash());
app.use(
  session({
    resave: true,
    saveUninitialized: true,
    secret: "secret1001",
  })
);

app.use(passport.initialize());
app.use(passport.session());

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/login", samlp);
app.use("/profile", ensureLoggedIn(), profile);
app.use("/logout", ensureLoggedIn(), (req, res) => {
  req.logOut();
  res.redirect("/");
});
app.use("/", index);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error("Not Found");
  err.status = 404;
  next(err);
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
