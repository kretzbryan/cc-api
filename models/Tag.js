const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
	handle: { type: String, required: true },
});

module.exports = mongoose.model('Message', messageSchema);
