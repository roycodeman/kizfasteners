const path = require('path');
// var http = require('http');
// var https = require('https');

const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const config = require('config');
const helmet = require('helmet');
const favicon = require('serve-favicon');
const compression = require('compression');

// const livereload = require('livereload');

const port = process.env.PORT || 3000;
const app = express();

// router
const contactusRoutes = require('./routes/contactus');
const adminRoutes = require('./routes/admin');

// mongoose
// mongodb://localhost/kizfasteners
mongoose.connect(config.get('services.dbName'), {
  useNewUrlParser: true
}).then(function () {
  console.log('Connected to...');
}).catch(function (err) {
  console.log('Couldn\'t connect to mongodb!', err);
});


/*
 * middlewares 
 */
app.use(helmet());
app.set('trust proxy', 1);
// parse epplication/x-www-form-urlencoded
app.use(bodyParser.urlencoded({
  extended: false
}));

// parse application/json
app.use(bodyParser.json());
app.use(cookieParser());

app.use(session({
  secret: config.get('services.kizSessionSecret'),
  resave: false,
  saveUninitialized: false
}));

app.use(compression());

// serving static files
app.use(express.static(path.join(__dirname, "dist")));
app.use(favicon(path.join(__dirname, "dist", "images", "kizfasteners.ico")));

// var server = livereload.createServer({
//   exts: ['html', 'css', 'js', 'png', 'jpg']
// });
// server.watch(path.join(__dirname, "public"));

// prerender
app.use(require('prerender-node').set('prerenderServiceUrl', 'http://www.kizfasteners.com'));

/*
 * routes
 */

// contactUs
app.use('/api', contactusRoutes);

// admin
app.use('/api', adminRoutes);


// rewrite virtual urls to angular app to enable refreshing of internal pages
app.use('*', function (req, res, next) {
  res.redirect('/');
});

app.use(function (err, req, res, next) {

  console.log(err);
  var err = new Error(err);
  err.code = err.code || 500;

  return res.status(err.code).json({
    message: err.message
  });

});


// Create an HTTP service.
// http.createServer(app).listen(port);
// // Create an HTTPS service identical to the HTTP service.
// https.createServer(app).listen(httpsPort);

app.listen(port, function () {
  console.log('Running on port', port);
});