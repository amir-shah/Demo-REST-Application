var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');

router.use(bodyParser.urlencoded({ extended: true }));
var Drone = require('../models/Drone');
var User = require('../models/User');

router.post('/', function (req, res){
	User.findById(req.body.ownerId, function(err, user) {
		if(err)
			return status(500).send("There was a problem");
		else {
			Drone.create({
				name: req.body.name,
				serialNumber: req.body.serialNumber,
				owner: user.id
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

