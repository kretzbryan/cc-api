
const mongoose = require('mongoose');
 
const commmentSchema = new mongoose.Schema({
    text: {type: String, required: true},
    name: {type: String, required: true},
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, {timestamps: true})

module.exports = mongoose.model('Comment', commmentSchema);