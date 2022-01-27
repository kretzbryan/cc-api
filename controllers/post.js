const express = require('express');
const router = express.Router();
const db = require('../models');
const auth = require('../middleware/auth')


// finds all posts and populates comments/comment users
router.get('/', async (req, res) => {
    try {
        const posts = await db.Post.find()
        .populate({
            path: 'comments',
            populate: {
                path: 'user',
                model: 'User'
            }
        })
        console.log('allposts', posts)
        res.status(200).json(posts)
    } catch (err) {
        res.status(400)
    }

    
})


// Finds post by Id
router.get('/:id', auth, async (req, res ) => {
    try {
        const post = await db.Post.findById(req.params.id);
        console.log(post)
        res.json({post});
    } catch (err) {
        console.log(err);
    }
})


// Find posts associated with specific User
router.get('/user/:id', auth, async (req, res) => {
    try {
        const posts = await db.Post.find({user : req.params.id})
        .populate({
            path: 'comments',
            populate: {
                path: 'user',
                model: 'User'
            }
        });
        res.json(posts)
    } catch (err) {
        console.log(err);
    }
})



// Creates a post with author id, adds post id to User.posts
router.post('/', auth, async (req, res) => {
    try {
        const user = await db.User.findById(req.user.id);
        const newPost = new db.Post({
            text: req.body.text,
            name: `${user.firstName} ${user.lastName}`,
            comments: req.body.comments,
            user: user._id
        }) 
        const savedPost = await newPost.save();
        await user.posts.push(savedPost._id);
        await user.save();
        res.json(savedPost)
    } catch (err) {
        console.log(err)
    }
} )

router.post('/:id/comment', auth, async (req, res) => {
    try {
        const user = await db.User.findById(req.user.id)
        const newComment = new db.Comment({
        text: req.body.text,
        name: `${user.firstName} ${user.lastName}`,
        user: user.id
        })
            await newComment.save();
            const post = await db.Post.findById(req.params.id).populate('comments');
            await post.comments.push(newComment)
            await post.save();
            res.json({post, newComment});
    } catch (err) {
        console.log(err);
    }
})

router.put('/:postid/comment/:commentid', auth, async (req, res) => {
    try {
        await db.Comment.findOneAndUpdate({_id: req.params.commentid}, {text: req.body.text}, {new: true});
        await db.Comment.findById(req.params.commentid);
        const post = await db.Post.findById(req.params.postid).populate('comments');
        console.log(post)
        res.json({post});
    } catch (err) {
        console.log(err)
    }
})

// updates post text
router.put('/:id', async (req, res) => {
    try {
        const post = await db.Post.findByIdAndUpdate(req.params.id, req.body, {new: true});
        res.json(post)
    } catch (err) {
        console.log(err)
    }
})



// deletes post and comments associated
router.delete('/:id', auth, async (req, res) => {
    try {
        const post = await db.Post.findById(req.params.id);

        if(post.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'User not Authorized' })
        }
        const user = await db.User.findById(req.user.id);
        await post.comments.forEach(async comment => {
            await db.Comment.findByIdAndDelete(comment._id);
        })
        await user.posts.remove(post);
        await user.save();
        await post.remove();
        res.json(post)
        

    } catch (err) {
        console.log(err)
    }
})

router.delete('/:postid/comment/:commentid', async (req, res) => {
    try {
        const comment = await db.Comment.findById(req.params.commentid);
        const post = await db.Post.findById(req.params.postid);
        await post.comments.remove(comment);
        await post.save();
        await comment.remove();
        res.json({post})
    } catch (err) {
        console.log(err);
    }
})

module.exports = router;
