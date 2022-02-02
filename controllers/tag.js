const express = require('express');
const router = express.Router();
const db = require('../models');
const auth = require('../middleware/auth');

router.get('/', async (req, res) => {
	// const { text } = req.body;
	console.log('text', req.body);
	try {
		const tags = await db.Tag.find({ handle: { $regex: text } });

		res.json({ tags });
	} catch (err) {
		console.log(err);
	}
});

router.post('/', async (req, res) => {
	const { text } = req.body;
	try {
		let tag;
		tag = await db.Tag.findById(req.params.id);
		if (!tag) {
			tag = await db.Tag.create({ text });
		}

		res.json({ tag });
	} catch (err) {
		console.log(err);
	}
});

module.exports = router;
