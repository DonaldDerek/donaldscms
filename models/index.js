'use strict';

var mongoose = require('mongoose');

var projectsModel = function(){

	var projectSchema = mongoose.Schema({
		name: String,
		date: {type: Date, default: Date.now},
		description: String,
		link: String,
		github: String,
		image: String

	});

	projectSchema.pre('save', function (next){
		next();
	})

	return mongoose.model('Project', projectSchema);
}

module.exports = new projectsModel();