const path = require('path');
const crypto = require('crypto');
const express = require('express');
const router = express.Router();
const db = require('../models');
// const upload = require('../middleware/upload');

// Shows all profiles with the exception of the current User
router.get('/all', async (req, res) => {
	try {
		const profiles = await db.User.find().select('-password');
		const user = req.user.id;
		res.json({ profiles, user });
	} catch (err) {
		res.status(500).send({ msg: 'An error occured.' });
	}
});

router.get('/:id', async (req, res) => {
	try {
		const foundProfile = await db.User.findById(req.params.id)
			.populate({
				path: 'posts',
				populate: [
					{
						path: 'createdBy',
						model: 'User',
					},
					{
						path: 'comments',
						model: 'Comment',
						populate: [
							{
								path: 'createdBy',
								model: 'User',
							},
							{
								path: 'comments',
								model: 'Comment',
								populate: {
									path: 'createdBy',
									model: 'User',
								},
							},
						],
					},
				],
			})
			.populate('gigs')
			.catch((err) => {
				throw {
					message: err.message,
				};
			});
		console.log('foundprofile', foundProfile);
		res.status(200).json(foundProfile);
	} catch (err) {
		console.log(err.message);
	}
});

// router.put('/image', async function (req, res) {
// 	req.file = req.files.file;
// 	try {
// 		await upload(req, res);
// 		const updatedUser = await db.User.findByIdAndUpdate(req.user.id, {
// 			profileImage: {
// 				filename: req.file.name,
// 				mimetype: req.file.mimetype,
// 			},
// 		}).select('-password');
// 		if (req.file === undefined) {
// 			return res.send('Select a file');
// 		}
// 		res.json(updatedUser);
// 	} catch (err) {
// 		console.log(err);
// 		return res.send('Error when uploading.');
// 	}
// });
// change

// creates a show route based on file name to for reference later
// router.get('/image/:filename', (req, res) => {
// 	gfs.files.findOne({ filename: req.params.filename }, (err, file) => {
// 		if (!file) {
// 			res.status(404).json({ message: 'image not found' });
// 		}
// 		if (file.contentType === 'image/jpeg' || file.contentType === 'image/png') {
// 			const readstream = gfs.createReadStream(file.filename);
// 			readstream.pipe(res);
// 		}
// 	});
// });

router.put('/edit-profile/:id', (req, res) => {
	db.User.findByIdAndUpdate(
		req.params.id,
		req.body,
		{ new: true },
		(err, updatedUser) => {
			if (err) {
				console.log(err);
			} else {
				res.redirect('/home');
			}
		}
	);
});

router.delete('/delete/:id', async (req, res) => {
	try {
		const deletedUser = await db.User.findByIdAndDelete(req.params.id);
		const deletedPosts = await db.Post.remove({ author: deletedUser._id });
		const deletedGigs = await db.Gig.remove({ author: deletedUser._id });
	} catch (err) {
		console.log(err);
	}
});

module.exports = router;
