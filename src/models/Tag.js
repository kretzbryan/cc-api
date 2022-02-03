const mongoose = require('mongoose');

const tagSchema = new mongoose.Schema({
	tagType: {
		type: String,
		required: true,
	},
	handle: { type: String, required: true },
});

module.exports = mongoose.model('Tag', tagSchema);
