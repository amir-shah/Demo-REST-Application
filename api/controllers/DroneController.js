var express 	= require('express');
var router 		= express.Router();
var bodyParser 	= require('body-parser');
var jwt         = require('jwt-simple');
var passport	= require('passport');

var config = require('../../config/database');

router.use(bodyParser.urlencoded({ extended: true }));
var Drone = require('../models/Drone');
var User = require('../models/User');

// Register new drone given SN and user object ID
router.post('/register', passport.authenticate('jwt', {session: false}), function (req, res){
	var token = getToken(req.headers);
	if(token){
		var decoded = jwt.decode(token, config.secret);
		User.findOne({
			email: decoded.email
		}, function(err, currUser) {
			if(err) throw err;
			if(!currUser)
				return res.status(403).send({ success: false, msg: 'User not found' });
			else{
				if(req.body && req.body.ownerId){
					User.findById(req.body.ownerId, function(err, user) {
						if(err)
							return res.status(500).send("There was a problem " + err);
						else if((user.team == currUser.team && currUser.admin) || user.id == currUser.id){
							Drone.create({
								name: req.body.name,
								serialNumber: req.body.serialNumber,
								owner: user.id,
								created_at: Date(),
								team: user.team
							},
							function (err, drone) {
								if(err)
									if(err.code == 11000)
										return res.status(400).send("That SN already exists");
									else
										return res.status(500).send("There was a problem adding this info to the DB");
								else
									res.status(200).send(drone);
							});
						}
						else
							return res.status(400).send("You can only add drones to yourself or your team (if you are admin)")
					});
				}
			}
		});	
	}
});

//Returns array of a user's drone (if you are authorized to see them)
router.post('/getUserDrones', passport.authenticate('jwt', {session: false}), function (req, res) {
	var token = getToken(req.headers);
	if(token){
		var decoded = jwt.decode(token, config.secret);
		User.findOne({
			email: decoded.email
		}, function(err, currUser) {
			if(err) throw err;
			if(!currUser)
				return res.status(400).send({ success: false, msg: 'User not found' });
			else{
				User.findById(req.body.ownerId, function(err, user) {
					if(currUser.id == user.id || (currUser.team == user.team && currUser.admin)){
						Drone.find({owner: req.body.ownerId}, function(err, drones) {
							if(err)
								return res.status(500).send("There was a problem");
							else
								res.status(200).send({drones: drones});
						});
					}
					else
						res.status(403).send({success:false, msg: 'You can only view drones for yourself or users you admin'})
				});
				
			}	
		});
	}
	else 
		res.status(403).send({success:false, msg: 'Must first login and send token'});
});

// Returns all team's drones
router.get('/getTeamDrones', passport.authenticate('jwt', {session: false}), function (req, res) {
	var token = getToken(req.headers);
	if(token){
		var decoded = jwt.decode(token, config.secret);
		User.findOne({
			email: decoded.email
		}, function(err, currUser) {
			if(err) throw err;
			if(!currUser)
				return res.status(400).send({ success: false, msg: 'User not found' });
			else{
				console.log(currUser.admin)
				if(currUser.admin){
					Drone.find({team: currUser.team}, function(err, drones) {
						if(err)
							return res.status(500).send("There was a problem");
						else
							res.status(200).send({success:true, drones: drones});
					});
				}
				else
					res.status(403).send({success:false, msg: 'You can only view drones for yourself or users you admin'})
				
			}	
		});
	}
	else 
		res.status(500).send({success:false, msg: 'Must first login and send token'});
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

