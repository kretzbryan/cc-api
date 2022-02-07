const mongoose = require('mongoose');
const { comment } = require('../controllers');

const messageThreadSchema = new mongoose.Schema(
	{
		subject: {
			type: String,
			required: true,
		},
		messageType: {
			type: String,
			required: true,
		},
		users: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: 'User',
			},
		],
		messages: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: 'Message',
			},
		],
		reactions: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: 'Reaction',
			},
		],
	},
	{ timestamps: true }
);

module.exports = mongoose.model('MessageThread', messageThreadSchema);
