var express 	= require('express');
var app 		= express();
var helmet 		= require('helmet');
var passport	= require('passport');
var jwt         = require('jwt-simple');
var morgan      = require('morgan');
var bodyParser 	= require('body-parser');
var mongoose 	= require('mongoose');
var config 		= require('./config/database');

// App uses basic authentication and permissions
// TODO - Improve handeling of permissions using ACL
// TODO - Improve authentication: Use ratelimiter or koa to prevent Brute Force user autherntication
// TODO - Improve security against: Command Injection
// TODO - Add HTTPS compatability 
// TODO - General: Cleanup response codes  
require('./config/passport')(passport);
mongoose.connect(config.database);

app.use(helmet());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(morgan('dev'));
app.use(passport.initialize());

var UserController = require('./api/controllers/UserController');
app.use('/users', UserController);

var DroneController = require('./api/controllers/DroneController');
app.use('/drones', DroneController);

var RecordingController = require('./api/controllers/RecordingController');
app.use('/recordings', RecordingController);

app.get('/uploads/:fileId', function (req, res) {
  res.sendFile(__dirname + '/uploads/' +  req.params.fileId)
})

module.exports = app;