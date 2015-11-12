//	process.env.DATABASE_URL = "postgres://sszyjrlzkervwe:esNr0F80N3V6Q-mqZ_QynGVm12@ec2-54-197-238-19.compute-1.amazonaws.com:5432/dbcivt80itdj1b?ssl=true"; // URL HerokuPostgres
        process.env.DATABASE_URL = "postgres://bhrkbauenflgcl:4lYxYtgoGqmmFp35vs_DB7kbhl@ec2-107-22-175-206.compute-1.amazonaws.com:5432/d3d2frtb1cvv4h";
	process.env.DATABASE_STORAGE = "quiz.sqlite";
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var partials=require('express-partials');
var methodOverride = require('method-override');
var session = require('express-session');
var routes = require('./routes/index');
//var users = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(partials());
// uncomment after placing your favicon in /public
app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser('Quiz'));
app.use(session());

app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));

//session timeout
app.use(function(req, res, next){
    var actualTime;
    actualTime = Date.now();
    if(req.session.user){
        if((actualTime - 120000) > req.session.lastTime){
            req.session.lastTime = actualTime;
            res.redirect('/logout');
        }else{
            req.session.lastTime = actualTime;
            res.locals.session = req.session;
            next();
        }
    }else{
        next();
    }
});


// Helpers dinamicos:
app.use(function(req, res, next) {

  // si no existe lo inicializa
  if (!req.session.redir) {
    req.session.redir = '/';
  }

// guardar path en session.redir para despues de login
//  if (!req.path.match(/\/login|\/logout/)) {
  if (!req.path.match(/\/login|\/logout|\/user/)) {

    req.session.redir = req.path;
  }

  // Hacer visible req.session en las vistas
  res.locals.session = req.session;
  next();
});



app.use('/', routes);
//app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err,
      errors: []
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {},
    errors: []
  });
});


module.exports = app;
