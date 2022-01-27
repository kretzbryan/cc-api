const express = require('express');
const router = express.Router();
const db = require('../models');
const auth = require('../middleware/auth')

router.get('/', async (req, res) => {
    try {
        const gigs = await db.Gig.find();
        res.json( gigs )
    } catch (err) {
        console.log(err)
    }
})

router.get('/:id', async (req, res) => {
    try {
        const gig = await db.Gig.findById(req.params.id);
        res.json( gig )
    } catch (err) {
        console.log(err)
    }
})

// Creates gig with author Id, adds gig id to user.Gigs
router.post('/', auth, async (req, res) => {
    try {
        const user = await db.User.findById(req.user.id).select('-password')
        const gig = new db.Gig({
            title: req.body.title,
            location: req.body.location,
            text: req.body.text,
            name: `${user.firstName} ${user.lastName}`,
            user: user.id
        })
        await gig.save();
        await user.gigs.push(gig._id);
        await user.save();
        res.json({gig});
    } catch(err) {
        console.log(err)
        res.status(500).json({ msg: 'An error occured, please try again.' })
    }

})

router.get('/recent',  auth, async (req, res) => {
    try {
        const recentGigs = await db.Gig.aggregate([
            {$sort: {createdAt: -1} },
            {$lookup: {
                from: 'users',
                localField: 'user',
                foreignField: '_id',
                as: 'user_doc'
            }}
        ]);
        res.json(recentGigs);
    } catch (err) {
        console.log(err)
    }
})


router.get('/recent/:num',  auth, async (req, res) => {
    try {
        const parsedInt = parseInt(req.params.num);
        const recentGigs = await db.Gig.aggregate([
            {$sort: {createdAt: -1} },
            {$limit: parsedInt},
            {$lookup: {
                from: 'users',
                localField: 'user',
                foreignField: '_id',
                as: 'user_doc'
            }}
        ]);
        res.json(recentGigs)
    } catch (err) {
        console.log(err)
    }
})

// Edit
router.put('/:id', (req, res) => {
    db.Gig.findByIdAndUpdate(req.params.id, req.body, {new:true}, (err, updatedGig) => {
        if (err) {
            console.log(err);
        } else {
            res.redirect('/home');
        }
    })
})


// Delete Gig
router.delete('/:id', (req, res) => {
    db.Gig.findByIdAndDelete(req.params.id, (err, deletedGig) => {
        if(err) {
            console.log(err)
        } else {
            db.User.findById(deletedGig.author, (err, foundUser) => {
                if(err) {
                    console.log(err);
                } else {
                    foundUser.gigs.remove(deletedGig)
                    foundUser.save();
                    res.redirect('/home');
                }
            })
        }
    })
})
module.exports = router;