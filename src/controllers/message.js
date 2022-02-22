const express = require('express');
const router = express.Router();
const db = require('../models');

// router.get('/get-messages/:id', async (req, res) => {
// 	try {
// 		const { id } = req.params;
// 		const foundThread = await db.MessageThread.findById(threadId).catch(
// 			(err) => {
// 				throw {
// 					message: err.message,
// 				};
// 			}
// 		);
// 		if (foundThread.users.includes(threadId)) {
// 			const savedMessage = await db.Message.create(message).catch((err) => {
// 				throw {
// 					message: err.message,
// 				};
// 			});
// 			foundThread.messages.push(message);
// 			await foundThread.save();
// 			res.status(200).json({ savedMessage });
// 		}
// 	} catch (err) {
// 		console.log(err.message);
// 	}
// });

router.post('/read', async (req, res) => {
	try {
		const { threadId } = req.body;
		const user = await db.User.findById(req.user.id).populate([
			{
				path: 'threads.unread',
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
			},
			{
				path: 'threads.read',
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
			},
		]);
		const foundThread = await db.MessageThread.findById(threadId)
			.populate({
				path: 'messages',
				model: 'Message',
				populate: {
					path: 'createdBy',
					model: 'User',
				},
			})
			.catch((err) => {
				throw {
					message: err.message,
				};
			});

		if (foundThread.users.includes(req.user.id)) {
			user.threads.read.push(foundThread);
			user.threads.unread = user.threads.unread.filter((readThread) => {
				return readThread._id.toString() !== foundThread._id.toString();
			});

			const savedUser = await user.save();
			res.status(200).json({ savedUser });
		}
	} catch (err) {
		console.log(err.message);
	}
});

const updateUsers = async (thread, sender) => {
	const { users } = thread;
	const senderId = sender._id.toString();
	const updatedUsers = await Promise.all(
		users.map(async (recipient) => {
			if (recipient.toString() !== senderId) {
				console.log('going to update!');
				const updatedUser = await db.User.findById(recipient).populate('');
				if (updatedUser.threads.read.includes(thread._id)) {
					updatedUser.threads.unread.push(thread);
					updatedUser.threads.read = updatedUser.threads.read.filter(
						(readThread) => {
							return readThread.toString() !== thread._id.toString();
						}
					);
					const savedUser = await updatedUser.save();
					console.log(savedUser);
					return savedUser;
				} else {
					return recipient;
				}
			} else {
				return recipient;
			}
		})
	);
};

router.post('/send-message', async (req, res) => {
	try {
		const { threadId, message } = req.body;
		const user = await db.User.findById(req.user.id);
		const foundThread = await db.MessageThread.findById(threadId)
			.populate({
				path: 'messages',
				model: 'Message',
				populate: {
					path: 'createdBy',
					model: 'User',
				},
			})
			.catch((err) => {
				throw {
					message: err.message,
				};
			});
		if (foundThread.users.includes(req.user.id)) {
			const newMessage = new db.Message({ ...message, createdBy: user });
			const savedMessage = await newMessage.save().catch((err) => {
				throw {
					message: err.message,
				};
			});
			foundThread.messages.push(savedMessage);
			const savedThread = await foundThread.save().catch((err) => {
				throw {
					message: err.message,
				};
			});

			await updateUsers(savedThread, user);
			res.status(200).json({ savedThread });
		}
	} catch (err) {
		console.log(err.message);
	}
});

router.post('/new-message-thread', async (req, res) => {
	const { message } = req.body;
	try {
		// Find User
		const user = await db.User.findById(req.user.id).catch((err) => {
			throw {
				message: err.message,
			};
		});
		// Create message with user Credentials
		const newMessage = await db.Message.create({
			createdBy: user._id,
			text: message.text,
		});

		const newThread = await db.MessageThread.create({
			users: [...message.recipients, user],
			messages: [newMessage],
			subject: message.subject,
			messageType: message.messageType,
		});

		// Find recipient(s) and add new Thread to messages
		const recipient = await db.User.findById(message.recipients[0]).catch(
			(err) => {
				throw {
					message: err.message,
				};
			}
		);
		recipient.threads.unread.push(newThread);

		user.threads.read.push(newThread);

		await user.save();
		await recipient.save();

		res.status(200).json({ success: true });
	} catch (err) {
		console.log(err.message);
	}
});

module.exports = router;
