const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
	{
		firstName: { type: String, required: true },
		lastName: { type: String, required: true },
		username: { type: String, required: true, unique: true, minlength: 6 },
		email: { type: String, required: true, unique: true },
		password: { type: String, required: true, select: false },
		skills: { type: String, required: false },
		profileImage: { type: String, required: false },
		location: { type: String, required: false },
		certifications: [
			{
				type: String,
				required: false,
			},
		],
		insurance: { type: String, required: false },
		occupation: { type: String, required: false },
		location: {
			lat: { type: Number, required: false },
			lng: { type: Number, required: false },
			name: { type: String, required: false },
			address: { type: String, required: false },
		},
		posts: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: 'Post',
			},
		],
		gigs: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: 'Gig',
			},
		],
		events: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: 'Event',
			},
		],
		connections: {
			requests: {
				incoming: [
					{
						type: mongoose.Schema.Types.ObjectId,
						ref: 'User',
					},
				],
				outgoing: [
					{
						type: mongoose.Schema.Types.ObjectId,
						ref: 'User',
					},
				],
			},
			confirmed: [
				{
					type: mongoose.Schema.Types.ObjectId,
					ref: 'User',
				},
			],
		},
		notifications: {
			new: [
				{
					type: mongoose.Schema.Types.ObjectId,
					ref: 'Notification',
				},
			],
			read: [
				{
					type: mongoose.Schema.Types.ObjectId,
					ref: 'Notification',
				},
			],
		},
		threads: {
			unread: [
				{
					type: mongoose.Schema.Types.ObjectId,
					ref: 'MessageThread',
				},
			],
			read: [
				{
					type: mongoose.Schema.Types.ObjectId,
					ref: 'MessageThread',
				},
			],
		},
		following: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Following',
		},
		privacy: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Privacy',
		},
	},
	{ timestamps: true }
);

module.exports = mongoose.model('User', userSchema);
