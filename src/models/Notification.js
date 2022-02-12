const mongoose = require('mongoose');
const { comment } = require('../controllers');

const notificationSchema = new mongoose.Schema(
	{
		notificationType: { type: String, required: true },
		data: { type: mongoose.Schema.Types.ObjectId },
	},
	{ timestamps: true }
);

module.exports = mongoose.model('Notification', notificationSchema);
