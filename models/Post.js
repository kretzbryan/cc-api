const mongoose = require('mongoose');

const postSchema = new mongoose.Schema(
	{
		postType: {
			type: String,
			required: true,
		},
		viewability: {
			type: String,
			required: true,
			default: 'Everyone',
		},
		text: { type: String, required: true },
		comments: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: 'Comment',
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
		tags: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: 'Tag',
			},
		],
	},
	{ timestamps: true }
);

module.exports = mongoose.model('Post', postSchema);
