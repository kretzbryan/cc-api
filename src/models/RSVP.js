const mongoose = require('mongoose');

const rsvpSchema = new mongoose.Schema(
	{
		event: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Event',
		},
		interested: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: 'User',
			},
		],
		going: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: 'User',
			},
		],
		notGoing: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: 'User',
			},
		],
	},
	{ timestamps: true }
);

module.exports = mongoose.model('RSVP', rsvpSchema);
