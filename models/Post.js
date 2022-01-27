const mongoose = require('mongoose')


const postSchema = new mongoose.Schema({
    text: {type: String, required: true},
    name: {type: String, required: true},
    comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment'
    }],
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, {timestamps: true})

module.exports = mongoose.model('Post', postSchema);