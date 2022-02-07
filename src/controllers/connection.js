const express = require('express');
const router = express.Router();
const db = require('../models');

router.post('/new-connection', async (req, res) => {
	const { recipient, message } = req.body;
	try {
		const user = await db.User.findById(req.user.id).catch((err) => {
			throw {
				message: err.message,
			};
		});

		const foundRecipient = await db.User.findById(recipient).catch((err) => {
			throw {
				message: err.message,
			};
		});

		foundRecipient.connections.requests.incoming = [
			...foundRecipient.connections.requests.incoming,
			user,
		];

		user.connections.requests.outgoing = [
			...user.connections.requests.outgoing,
			foundRecipient,
		];

		if (message) {
			const newMessage = await db.Message.create({
				createdBy: user._id,
				text: message.text,
			});

			const newThread = await db.MessageThread.create({
				users: [...message.recipients, user],
				messages: [newMessage],
				subject: message.subject,
			});

			// Find recipient(s) and add new Thread to messages

			foundRecipient.message = {
				unreadCount: unreadCount++,
				messages: [...foundRecipient.message.messages, newThread],
			};
			user.message = {
				...user.message,
				messages: [...user.message.messages, newThread],
			};
		}
		await user.save();
		await foundRecipient.save();

		restart.status(200).json({ success: true });
	} catch (err) {
		console.log(err.message);
	}
});
module.exports = router;
