const express = require('express');
const router = express.Router();
const db = require('../models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const auth = require('../middleware/auth');

const handleNotificationPopulate = async (notification) => {
	let data;
	if (notification.notificationType === 'comment') {
		console.log('notification', notification);
		data = await db.Post.findById(notification.data).populate('createdBy');
	}
	return {
		...notification._doc,
		data,
	};
};

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
			.populate('notifications.new notifications.read')
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

		const notifications = {
			new: await Promise.all(
				user.notifications.new.map(async (notification) => {
					return await handleNotificationPopulate(notification);
				})
			),
			read: await Promise.all(
				user.notifications.read.map(async (notification) => {
					return await handleNotificationPopulate(notification);
				})
			),
		};
		let userCopy = { ...user._doc, notifications };

		console.log(userCopy.notifications.new);

		res.json({ user: userCopy });
	} catch (err) {
		res.status(500).send({ msg: err.message });
	}
});

router.post('/update', async (req, res) => {
	try {
		console.log('req.body', req.body);
		const user = await db.User.findByIdAndUpdate(req.user.id, req.body.user);

		res.status(200).json({ user });
	} catch (err) {
		res.status(500).send({ msg: err.message });
	}
});

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
