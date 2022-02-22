const express = require('express');
const router = express.Router();
const db = require('../models');

router.post('/new', async (req, res) => {
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

		foundRecipient.connections.requests.incoming.push(user);

		user.connections.requests.outgoing.push(foundRecipient);

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

		res.status(200).json({ success: true });
	} catch (err) {
		console.log(err.message);
	}
});

router.post('/approve', async (req, res) => {
	const { connectionId } = req.body;
	try {
		const user = await db.User.findById(req.user.id).populate(
			'connections.requests.incoming connections.requests.outgoing connections.confirmed'
		);
		const newConnection = await db.User.findById(connectionId).populate(
			'connections.requests.incoming connections.requests.outgoing connections.confirmed'
		);
		user.connections.requests.incoming =
			user.connections.requests.incoming.filter(
				(connection) => connection._id.toString() !== connectionId.toString()
			);
		user.connections.confirmed.push(newConnection);

		newConnection.connections.requests.outgoing =
			newConnection.connections.requests.outgoing.filter(
				(connection) => connection._id.toString() !== connectionId.toString()
			);
		newConnection.connections.confirmed.push(user);
		await user.save();
		await newConnection.save();
		res.json({ connections: user._doc.connections });
	} catch (err) {
		console.log(err);
		res.status(500).json({ msg: 'An error occured, please try again.' });
	}
});

router.post('/deny', async (req, res) => {
	const { connectionId } = req.body;
	try {
		const user = await db.User.findById(req.user.id).populate(
			'connections.requests.incoming connections.requests.outgoing connections.confirmed'
		);

		const foundConnection = await db.User.findById(connectionId).populate(
			'connections.requests.incoming connections.requests.outgoing connections.confirmed'
		);

		user.connections.requests.incoming =
			user.connections.requests.incoming.filter(
				(connection) => connection._id.toString() !== connectionId.toString()
			);
		foundConnection.connections.requests.outgoing =
			foundConnection.connections.requests.outgoing.filter(
				(connection) => connection._id.toString() !== user._id.toString()
			);
		await user.save();
		await foundConnection.save();
		res.json({ connections: user._doc.connections });
	} catch (err) {
		console.log(err);
		res.status(500).json({ msg: 'An error occured, please try again.' });
	}
});

router.post('/remove', async (req, res) => {
	const { connectionId } = req.body;
	try {
		const user = await db.User.findById(req.user.id).populate(
			'connections.requests.incoming connections.requests.outgoing connections.confirmed'
		);

		const foundConnection = await db.User.findById(connectionId).populate(
			'connections.requests.incoming connections.requests.outgoing connections.confirmed'
		);

		user.connections.confirmed = user.connections.confirmed.filter(
			(connection) => connection._id.toString() !== connectionId.toString()
		);
		foundConnection.connections.confirmed =
			foundConnection.connections.confirmed.filter(
				(connection) => connection._id.toString() !== user._id.toString()
			);
		await user.save();
		await foundConnection.save();
		res.json({ connections: user._doc.connections });
	} catch (err) {
		console.log(err);
		res.status(500).json({ msg: 'An error occured, please try again.' });
	}
});

module.exports = router;
