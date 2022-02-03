const mongoose = require('mongoose');
const { comment } = require('../controllers');

const messageSchema = new mongoose.Schema(
	{
		title: { type: String, required: true },
		text: { type: String, required: true },
		createdBy: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
		},
		read: {
			type: Boolean,
			required: true,
		},
	},
	{ timestamps: true }
);

module.exports = mongoose.model('Message', messageSchema);
