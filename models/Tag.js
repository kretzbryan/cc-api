const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
	tagType: {
		type: String,
		required: true,
	},
	handle: { type: String, required: true },
});

module.exports = mongoose.model('Message', messageSchema);
