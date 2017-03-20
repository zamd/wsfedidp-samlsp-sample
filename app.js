var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var passport =require('passport');
var ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn;

var profile = require('./routes/profile');
var login = require('./routes/login');
const samlp = require('./routes/samlp');
const wsfed = require('./routes/wsfed');

require('./passport-setup');

var app = express();

app.use(session({
  resave: true,
  saveUninitialized: true,
  secret: 'secret1001'
}));

app.use(passport.initialize());
app.use(passport.session());


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/login', login);
app.use('/logout',(req,res,next)=>{
  req.logout();
  res.redirect('/login');
});

app.use('/',wsfed);

app.use('/saml_login/',samlp);

app.use('/profile', ensureLoggedIn('/login'), profile);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
