const mongoose = require('mongoose');

const userMessageSchema = new mongoose.Schema({
	messages: { type: String, required: true },
});

module.exports = mongoose.model('UserMessage', userMessageSchema);
