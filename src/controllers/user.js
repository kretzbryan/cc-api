const express = require('express');
const router = express.Router();
const db = require('../models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const auth = require('../middleware/auth');

router.get('/', async (req, res) => {
	try {
		console.log(req.user);
		const user = await db.User.findById(req.user.id)
			.select('-password')
			.populate({
				path: 'message.messages',
				populate: [
					{
						path: 'users',
						model: 'User',
					},
					{
						path: 'messages',
						model: 'Message',
						populate: {
							path: 'createdBy',
							model: 'User',
						},
					},
				],
			})
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
			});
		res.json({ user });
	} catch (err) {
		res.status(500).send({ msg: err.message });
	}
});

router.ge;

router.post('/check-unique-field', async (req, res) => {
	try {
		console.log('req.body', req.body);
		let user, user1, user2;
		user = await db.User.findOne({
			[req.body.key]: req.body.value,
		});
		if (req.body.key === 'email' && !user) {
			console.log('checking second email');
			user = await db.User.findOne({
				newEmail: req.body.value,
			});
		}
		// user = user1 || user2;

		if (req.user.id.valueOf() === (user && user._id.valueOf()) || !user) {
			res.status(200).json({ unique: true });
		} else {
			res.status(200).json({ unique: false });
		}
	} catch (err) {
		res.status(500).send({ msg: err.message });
	}
});

router.get('/messages', async (req, res) => {
	try {
		const user = await db.User.findById(req.user.id);

		res.json({ user });
	} catch (err) {
		res.status(500).send({ msg: err.message });
	}
});

module.exports = router;
