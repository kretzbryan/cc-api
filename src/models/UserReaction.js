const mongoose = require('mongoose');

const userReactionSchema = new mongoose.Schema(
	{
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
		},
		reaction: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Reaction',
		},
		itemType: {
			type: String,
			required: true,
		},
		itemId: {
			type: mongoose.Schema.Types.ObjectId,
		},
	},
	{ timestamps: true }
);

module.exports = mongoose.model('UserReaction', userReactionSchema);
