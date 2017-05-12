var express = require('express');
var app = express();
var db = require('./db'); 

var UserController = require('./api/controllers/UserController');
app.use('/users', UserController);

var DroneController = require('./api/controllers/DroneController');
app.use('/drones', DroneController);

var RecordingController = require('./api/controllers/RecordingController');
app.use('/recordings', DroneController);

module.exports = app;