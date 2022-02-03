const mongoose = require('mongoose');

const privacySchema = new mongoose.Schema({
	all: {
		type: Boolean,
		required: true,
		default: true,
	},
	friends: {
		type: Boolean,
		required: true,
		default: false,
	},
	friendsOfFriends: { type: Boolean, required: true, default: false },
});

module.exports = mongoose.model('Privacy', privacySchema);
