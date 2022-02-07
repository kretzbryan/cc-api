const mongoose = require('mongoose');
const { comment } = require('../controllers');

const messageSchema = new mongoose.Schema(
	{
		text: { type: String, required: true },
		createdBy: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
		},
		read: {
			type: Boolean,
			required: true,
		},
		reaction: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Reaction',
			required: false,
		},
	},
	{ timestamps: true }
);

module.exports = mongoose.model('Message', messageSchema);
