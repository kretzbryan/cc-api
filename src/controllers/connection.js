const express = require('express');
const router = express.Router();
const db = require('../models');

router.post('/', async (req, res) => {
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
module.exports = router;
