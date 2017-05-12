var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');

router.use(bodyParser.urlencoded({ extended: true }));
var Drone = require('../models/Drone');
var User = require('../models/User');
var Recording = require('../models/Recording');

router.post('/', function (req, res){
	Drone.findById(req.body.droneId, function(err, drone) {
		if(err)
			return status(500).send("There was a problem");
		else {
			Recording.create({
				name: req.body.name,
				fileAddress: req.body.fileAddress,
				serialNumber: req.body.serialNumber,
				drone: drone,
				owner: drone.owner.id
			},
			function (err, user) {
				if(err)
					return status(500).send("There was a problem adding this info to the DB");
				res.status(200).send(user);
			});
		}
	});
	
});

router.get('/', function (req, res) {
	Drone.find({}, function (err, users) {
		if(err)
			return res.status(500).send("There was  aproblem");
		res.status(200).send(users);
	});
});



module.exports = router;

