const mongoose = require('mongoose');

const gigSchema = new mongoose.Schema(
	{
		title: { type: String, required: true },
		location: {
			address: { type: String, required: true },
			lng: { type: String, required: true },
			lat: { type: String, required: true },
			name: { type: String, required: true },
		},
		text: { type: String, required: true },
		imageLocation: { type: String, required: false },
		startDate: { type: String, required: true },
		duration: {
			value: { type: Number, required: true },
			unitOfMeasure: { type: String, required: true },
		},
		viewability: {
			type: String,
			required: true,
			default: 'Everyone',
		},
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

module.exports = mongoose.model('Gig', gigSchema);
