const express = require('express');
const router = express.Router();
const db = require('../models');

router.get('/all', async (req, res) => {
	try {
		const events = await db.Event.find({});
		res.status(200).json({ events });
	} catch (err) {
		console.log(err.message);
	}
});

router.post('/create', async (req, res) => {
	try {
		let newEvent, newRSVP, newLocation, foundUser;

		newEvent = new db.Event({
			...req.body,
			createdBy: req.user.id,
		});

		newRSVP = await db.RSVP.create({ event: newEvent }).catch((err) => {
			throw {
				message: err.message,
			};
		});
		foundUser = await db.User.findById(req.user.id).catch((err) => {
			throw {
				message: err.message,
			};
		});
		foundUser.events.push(newEvent);
		newEvent.rsvps = newRSVP;
		await newEvent.save().catch((err) => {
			throw {
				message: err.message,
			};
		});
		await foundUser.save().catch((err) => {
			throw {
				message: err.message,
			};
		});
		res.status(200).json({ success: true });
	} catch (err) {
		console.log(err.message);
	}
});

module.exports = router;
