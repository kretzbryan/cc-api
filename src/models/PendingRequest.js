const mongoose = require('mongoose');
const { comment } = require('../controllers');

const pendingRequestSchema = new mongoose.Schema({
	sent: {
		messages: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: 'Message',
			},
		],
		connections: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: 'User',
			},
		],
	},
	received: {
		messages: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: 'Message',
			},
		],
		connections: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: 'User',
			},
		],
	},
});

module.exports = mongoose.model('PendingRequest', pendingRequestSchema);
