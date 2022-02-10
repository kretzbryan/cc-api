const mongoose = require('mongoose');

const tagSchema = new mongoose.Schema({
	handle: { type: String, required: true },
});

module.exports = mongoose.model('Tag', tagSchema);
