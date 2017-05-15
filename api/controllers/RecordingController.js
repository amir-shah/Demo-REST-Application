// As spec'd per email: App only required to accept recordings
// TODO - Add features for: View team recordings, view user's recordings, Add to recording

var express 	= require('express');
var router 		= express.Router();
var bodyParser 	= require('body-parser');
var multer  	= require('multer');
var jwt         = require('jwt-simple');
var passport	= require('passport');

var config = require('../../config/database');
var upload = multer({
  dest: 'uploads/',
  filename: function (req, file, cb) {
  	cb(null, file.fieldname + '-' + Date.now())
  },
  onFileUploadStart: function (file) {
    console.log(file.originalname + ' is starting ...')
  },
  onFileUploadComplete: function (file) {
    console.log(file.fieldname + ' uploaded to  ' + file.path)
    imageUploaded=true;
  }
});



var Drone = require('../models/Drone');
var User = require('../models/User');
var Recording = require('../models/Recording');

//Set fields for expected Recordings upload
//TODO: Add file size limits, file type restrictions, file name limits
var recordingUpload = upload.fields([{ name: 'flightData', maxCount: 1 },
									 { name: 'photos', maxCount:20 },
									 { name: 'videos', maxCount: 3}])

// TODO: Add user authentication to verify that only user or team admin can add recordings for a drone
// TODO: Add check for array of video/photo length > 0
router.post('/upload', recordingUpload, function (req, res, next){
	console.log(req.files)
	console.log(req.body)
	Drone.findById(req.body.droneId, function(err, drone) {
		if(err || !drone)
			return res.status(500).send("Drone with that ID does not exist");
		else {
			//console.log(drone);
			//console.log(req.files);
			var videoPaths =[];
			var photoPaths = [];
			for(i = 0; i < req.files['videos'].length; i++)
				videoPaths.push(req.files['videos'][i].path);
			for(i = 0; i < req.files['videos'].length; i++)
				photoPaths.push(req.files['photos'][i].path);
			Recording.create({
				name: req.body.name,
				flightData: req.files['flightData'][0].path,
				photos: photoPaths,
				videos: videoPaths,
				drone: drone,
				owner: drone.owner.id,
				created_at: Date()
			},
			function (err, rec) {
				if(err){
					console.log(err)
					return res.status(500).send("There was a problem adding this info to the DB");
				}
				else
					res.status(200).send(rec);
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

