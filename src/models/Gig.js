const mongoose = require('mongoose');

const gigSchema = new mongoose.Schema(
	{
		title: { type: String, required: true },
		location: { type: String, required: true },
		text: { type: String, required: true },
		image: { type: String, required: false },
		name: { type: String, required: true },
		viewability: {
			type: String,
			required: true,
			default: 'Everyone',
		},
		createdBy: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
		},
	},
	{ timestamps: true }
);

module.exports = mongoose.model('Gig', gigSchema);
