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
		const user = await db.User.findById(req.user.id);
		const foundThread = await db.MessageThread.findById(threadId)
			.populate('messages')
			.catch((err) => {
				throw {
					message: err.message,
				};
			});

		if (foundThread.users.includes(req.user.id)) {
			const readMessages = await Promise.all(
				foundThread.messages.map(async (message) => {
					if (message.createdBy !== req.user.id) {
						const updatedMessage = await db.Message.findByIdAndUpdate(
							message._id,
							{ ...message, read: true },
							{ new: true }
						);
						return updatedMessage;
					} else {
						return message;
					}
				})
			);
			foundThread.messages = readMessages;
			const savedThread = await foundThread.save().catch((err) => {
				throw {
					message: err.message,
				};
			});
			res.status(200).json({ savedThread });
		}
	} catch (err) {
		console.log(err.message);
	}
});

router.post('/send-message', async (req, res) => {
	try {
		const { threadId, message } = req.body;
		const user = await db.User.findById(req.user.id);
		const foundThread = await db.MessageThread.findById(threadId).catch(
			(err) => {
				throw {
					message: err.message,
				};
			}
		);
		if (foundThread.users.includes(req.user.id)) {
			const newMessage = new db.Message(message);
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
			res
				.status(200)
				.json({ savedMessage: { ...savedMessage._doc, createdBy: user } });
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

		recipient.message = {
			unreadCount: recipient.message.unreadCount++,
			messages: [...recipient.message.messages, newThread],
		};
		user.message = {
			...user.message,
			messages: [...user.message.messages, newThread],
		};

		await user.save();
		await recipient.save();

		res.status(200).json({ success: true });
	} catch (err) {
		console.log(err.message);
	}
});

module.exports = router;
