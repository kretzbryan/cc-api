const express = require('express');
const router = express.Router();
const db = require('../models');
const auth = require('../middleware/auth');

router.post('/find-tag', async (req, res) => {
	const { value } = req.body;
	console.log('text', req.body);
	try {
		const tags = await db.Tag.find({ handle: { $regex: value } }).catch(
			(err) => {
				throw {
					message: err.message,
				};
			}
		);

		res.status(200).json({ tags });
	} catch (err) {
		console.log(err);
	}
});

router.post('/create-tag', async (req, res) => {
	const { value } = req.body;
	let tag;
	try {
		tag = await db.Tag.findOne({ handle: value });

		if (!tag) {
			console.log('no tag found!');
			tag = await db.Tag.create({ handle: value }).catch((err) => {
				throw {
					message: err.message,
				};
			});
		}

		res.status(200).json({ tag });
	} catch (err) {
		console.log(err);
	}
});

module.exports = router;
