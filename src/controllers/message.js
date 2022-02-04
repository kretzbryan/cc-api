const express = require('express');
const router = express.Router();
const db = require('../models');

router.post('/send-message', async (req, res) => {
	try {
		const { threadId, message } = req.body;
		const foundThread = await db.MessageThread.findById(threadId).catch(
			(err) => {
				throw {
					message: err.message,
				};
			}
		);
		if (foundThread.users.includes(threadId)) {
			const savedMessage = await db.Message.create(message).catch((err) => {
				throw {
					message: err.message,
				};
			});
			foundThread.messages.push(message);
			await foundThread.save();
			res.status(200).json({ savedMessage });
		}
	} catch (err) {
		console.log(err.message);
	}
});

router.post('/send-message-request', async (req, res) => {
	try {
		const { recipientId, message } = req.body;
		const user = await db.User.findById(req.user.id).catch((err) => {
			throw {
				message: err.message,
			};
		});

		const recipient = await db.User.findById(recipientId).catch((err) => {
			throw {
				message: err.message,
			};
		});
		const recipientPendingRequests = await db.PendingRequest.findById(
			recipient.pendingRequests
		).catch((err) => {
			throw {
				message: err.message,
			};
		});
		const newMessage = await db.Message.create(message).catch((err) => {
			throw {
				message: err.message,
			};
		});
		const newThread = new db.MessageThread();
		newThread.users = [user, recipient];
		newThread.users.push(newMessage);

		const savedThread = await newThread.save();

		recipientPendingRequests.messages.push(savedThread);
		user.messages.push(savedThread);
		await user.save();
		await recipientPendingRequests.save();

		res.status(200).json({ savedMessage });
	} catch (err) {
		console.log(err.message);
	}
});

module.exports = router;
