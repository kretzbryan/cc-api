const mongoose = require('mongoose');

const postSchema = new mongoose.Schema(
	{
		type: {
			type: String,
			required: true,
		},
		text: { type: String, required: true },
		name: { type: String, required: true },
		comments: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: 'Post',
			},
		],
		reactions: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: 'Reaction',
			},
		],
		createdBy: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
		},
	},
	{ timestamps: true }
);

module.exports = mongoose.model('Post', postSchema);
