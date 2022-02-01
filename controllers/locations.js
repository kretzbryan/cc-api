const express = require('express');
const router = express.Router();
const db = require('../models');
const auth = require('../middleware/auth');
const axios = require('axios');

router.get('/', async (req, res) => {
	const { text } = req.body;
	const params = text.split(' ');
	try {
		const placesURL = process.env.GOOGLE_PLACE_BASE_URL;
		const apiKey = process.env.GOOGLE_MAPS_API_KEY;

		const res = await axios({
			method: 'get',
			url: `${placesURL}?query=${params.map((item, index) => {
				if (index !== params.length - 1) {
					return `${item}%20`;
				} else {
					return item;
				}
			})}&key=${apiKey}`,
		}).catch((err) => {
			throw {
				message: err.message,
			};
		});

		res.json({ results: res.data });
	} catch (err) {
		console.log(err);
	}
});

module.exports = router;
