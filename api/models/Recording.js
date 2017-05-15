'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// This Schema represents a Recording object
// Recording consists of Flight Logs (flightData) from the DJI Go app. These are collected as .TXT files
// Log files contain time history of flights including GPS coordinates, altitude, and speed
// Recordings also consist of photos and videos taken during a flight
var RecordingSchema = new Schema({
	name: { type: String, required: true },
	flightData: {type: String, required: true},
	photos: [],
	videos: [],
	owner: { type: Schema.Types.ObjectId, ref: 'Users'},
	drone: { type: Schema.Types.ObjectId, ref: 'Drones'},
	created_at: Date,
	updated: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Recordings', RecordingSchema);
