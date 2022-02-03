const express = require('express');
const router = express.Router();
const db = require('../models');
const auth = require('../middleware/auth');

router.get('/discover', async (req, res) => {
	try {
		const people = await db.User.find({}).populate('privacy', {
			match: { everyone: true },
		});
		res.json({ discoverItems: people });
	} catch (err) {
		console.log(err);
	}
});

module.exports = router;
