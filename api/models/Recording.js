'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var RecordingSchema = new Schema({
	name: { type: String, required: true },
	fileAddress: { type: String, required: true },
	fileType: { 
		type: String,
		enum: ['flight_data', 'photo', 'video']
	},
	owner: [{ type: Schema.Types.ObjectId, ref: 'Users'}],
	drone: [{ type: Schema.Types.ObjectId, ref: 'Drones'}]
});

module.exports = mongoose.model('Recordings', RecordingSchema);
