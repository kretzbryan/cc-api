const mongoose = require('mongoose');

const followingSchema = new mongoose.Schema({
	people: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
		},
	],
	groups: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Group',
		},
	],
	pages: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Page',
		},
	],
});

module.exports = mongoose.model('Following', followingSchema);
