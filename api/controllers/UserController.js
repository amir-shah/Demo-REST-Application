var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');

router.use(bodyParser.urlencoded({ extended: true }));
var User = require('../models/User');
var Drone = require('../models/Drone');

router.post('/', function (req, res){
	User.create({
		name: req.body.name,
		email: req.body.email,
		password: req.body.password,
		team: req.body.team,
		admin: req.body.admin
	},
	function (err, user) {
		if(err)
			return status(500).send("There was a problem");
		res.status(200).send(user);
	});
});

router.get('/', function (req, res) {
	User.find({}, function (err, users) {
		if(err)
			return res.status(500).send("There was  aproblem");
		res.status(200).send(users);
	});
});

router.post('/addToTeam', function(req, res) {
	User.findById(req.body.id, function(err, user) {
		if(err)
			return status(500).send("There was a problem");
		else {
			user.team = req.body.team;
			user.admin = req.body.admin;
			
			user.save(function(err) {
				if(err)
					return status(500).send("there was a problem saving");
				else{
					console.log("User " + req.body.id + " updated team");
					res.status(200).send(user);
				}
			});
		}
	});
});

router.get('/getDrones', function(req, res) {
	Drone.find({owner: req.body.ownerId}, function(err, drones) {
		if(err)
			return status(500).send("There was a problem");
		res.status(200).send(drones);
	});
});

module.exports = router;

