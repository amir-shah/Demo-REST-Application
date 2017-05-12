'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
	name: { type: String, required: true, trim: true },
	email: { type: String, required: true, trim: true, index: { unique: true } },
	password: { type: String, required: true },
	team: String,
	admin: Boolean
});

module.exports = mongoose.model('Users', UserSchema);