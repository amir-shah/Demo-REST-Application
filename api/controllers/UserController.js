var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var jwt         = require('jwt-simple');
var passport	= require('passport');

var config = require('../../config/database');

router.use(bodyParser.urlencoded({ extended: true }));
var User = require('../models/User');
var Drone = require('../models/Drone');

// Register new user
// TODO - User should not be able to add self to team. They should request from admin
router.post('/signup', function (req, res){
	if (!req.body.email || !req.body.password || !req.body.email) {
	  res.status(403).json({success: false, msg: 'Please pass name, email, and password.'});
	} 
	else {
		var newUser = new User ({
			name: req.body.name,
			email: req.body.email,
			password: req.body.password,
			team: req.body.team,
			admin: false,
			created_at: Date()
		});
		newUser.save(function(err) {
			if(err)
				return res.json({success : false, msg: 'Email already exists'});
			res.status(200).json({sucess: true, msg: 'Successfully created new user'})
		})
	}
	
});

// Sign user in
router.post('/signin', function(req, res){
	User.findOne({ email: req.body.email }, function(err, user) {
		if(err) throw err;
		if(!user)
			res.status(500).send({ success: false, msg: 'User not found'});
		else {
			user.comparePassword(req.body.password, function (err, match) {
				if(match && !err) {
					var token = jwt.encode(user, config.secret);
					res.status(200).json({ token: 'JWT ' + token });
				}
				else
					res.status(500).send({ success: false, msg: 'Incorrect Password' });
			});
		}
	});
});

// Returns user objects for a team
// TODO - It would be better to have a seperate Team object. 
// Teams could have various properties such as location, profiles, etc
router.get('/getTeam', passport.authenticate('jwt', {session: false}), function (req, res) {
	var token = getToken(req.headers);
	if(token){
		var decoded = jwt.decode(token, config.secret);
		User.findOne({
			email: decoded.email
		}, function(err, user) {
			if(err) throw err;
			if(!user)
				return res.status(403).send({ success: false, msg: 'User not found' });
			else{
				if(!user.team)
					res.send({ success: false, msg: 'User is not on a team'});
				else{
					User.find({ team: user.team }, function (err, users) {
						if(err)
							res.status(500).send("There was  a problem");
						else
							res.status(200).send(users);
					});
				}	
			}
		});
	}
	
});

// Gets a single user's profile. Onyl user and team admins can view profiles
router.get('/getProfile', passport.authenticate('jwt', {session: false}), function (req, res) {
	var token = getToken(req.headers);
	if(token){
		var decoded = jwt.decode(token, config.secret);
		User.findOne({
			email: decoded.email
		}, function(err, currUser) {
			if(err) throw err;
			User.findById(req.body.userId, function(err, user) {
				if(!user)
					return res.status(403).send({ success: false, msg: 'User not found' });
				else{
					res.status(200).send({success: true, user: user});
				}
			});
		});
	}
	else 
		res.status(500).send({success:false, msg: 'Must first login and send token'});
});

//Adds a user to a team. Only team admins or the self can add user to a team
router.post('/addToTeam', passport.authenticate('jwt', {session: false}), function(req, res) {
	var token = getToken(req.headers);
	if(token){
		var decoded = jwt.decode(token, config.secret);
		User.findOne({
			email: decoded.email
		}, function(err, currUser) {
			User.findById(req.body.userId, function(err, user) {
				if(err || !user)
					return res.status(500).send("There was a problem");
				else {
					if(currUser.id == user.id || (currUser.team == user.team && currUser.admin)){
						user.team = currUser.team;
						if(currUser.admin)
							user.admin = req.body.admin;
		
						user.save(function(err) {
							if(err)
								return res.status(500).send("there was a problem saving");
							else{
								console.log("User " + user.name + " updated team");
								Drone.find({owner: user.id}, function (err, drones){
									if(err || !drones)
										res.status(200).send({user: user});
									else
										drones.forEach(function(drone) {
											drone.team = req.body.team;
											drone.save();
										});
								});
								res.status(200).send({user: user});
							}
						});
					}
					else
						res.status(403).send({success:false, msg: 'You can only change teams for yourself or users you admin'})
				}
			});
		});
	}
});





getToken = function (headers) {
  if (headers && headers.authorization) {
    var parted = headers.authorization.split(' ');
    if (parted.length === 2) {
      return parted[1];
    } else {
      return null;
    }
  } else {
    return null;
  }
};


module.exports = router;

