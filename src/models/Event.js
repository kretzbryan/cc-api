const mongoose = require('mongoose');
const { comment } = require('../controllers');

const eventSchema = new mongoose.Schema(
	{
		title: { type: String, required: true },
		description: { type: String, required: true },
		imageLocation: { type: String, required: false },
		createdBy: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
		},
		comments: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: 'Post',
			},
		],
		viewability: {
			type: String,
			required: true,
			default: 'Everyone',
		},
		startDate: { type: String, required: true },
		endDate: { type: String, required: true },
		startTime: { type: String, required: true },
		endTime: { type: String, required: true },
		rsvps: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'RSVP',
		},
		shares: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: 'Share',
			},
		],
		tags: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: 'Tag',
			},
		],
		location: {
			address: { type: String, required: true },
			lng: { type: String, required: true },
			lat: { type: String, required: true },
			name: { type: String, required: true },
		},
	},
	{ timestamps: true }
);

module.exports = mongoose.model('Event', eventSchema);
