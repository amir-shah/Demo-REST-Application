'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var DroneSchema = new Schema({
	name: { type: String, required: true },
	serialNumber: { type: String, required: true },
	owner: [{ type: Schema.Types.ObjectId, ref: 'Users'}]
});

module.exports = mongoose.model('Drones', DroneSchema);