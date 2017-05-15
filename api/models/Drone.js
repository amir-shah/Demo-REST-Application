'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//Schema represents a Drone object
var DroneSchema = new Schema({
	name: { type: String, required: true },
	serialNumber: { type: String, required: true, trim: true, index: { unique: true } },
	owner: { type: Schema.Types.ObjectId, ref: 'Users'},
	created_at: Date,
	updated: { type: Date, default: Date.now },
	team: String
});

module.exports = mongoose.model('Drones', DroneSchema);