const express = require('express');
const router = express.Router();
const db = require('../models');

router.post('/create', async (req, res) => {
	try {
		const { event } = req.body;
		let newEvent, newRSVP, newLocation, foundUser;
		newLocation = await db.Location.create(event.location).catch((err) => {
			throw {
				message: err.message,
			};
		});
		newEvent = await db.Event.create({
			...event,
			location: newLocation,
			createdBy: req.user,
		}).catch((err) => {
			throw {
				message: err.message,
			};
		});

		foundUser = await db.User.findById(req.user.id);
		foundUser.events.push(newEvent);
		res.status(200).json({ success: true });
	} catch (err) {
		console.log(err.message);
	}
});

module.exports = router;
