const mongoose = require('mongoose');
const { comment } = require('../controllers');

const eventSchema = new mongoose.Schema(
	{
		title: { type: String, required: true },
		text: { type: String, required: true },
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
		timeRange: {
			start: { type: Date, required: true },
			end: { type: Date, required: true },
		},
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
		location: { type: String, required: true },
		name: { type: String, required: true },
	},
	{ timestamps: true }
);

module.exports = mongoose.model('Event', eventSchema);
