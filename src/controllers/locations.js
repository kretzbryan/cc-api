const express = require('express');
const router = express.Router();
// const auth = require('../middleware/auth');
const axios = require('axios');

// router.get('/', async (req, res) => {
// 	console.log('accessing google search route');
// 	try {
// 		console.log('text', req.body);
// 		res.json({ post: 'this is some text' });
// 	} catch (err) {
// 		console.log(err);
// 	}
// });

router.post('/', async (req, res) => {
	const { text } = req.body;
	const params = text.split(' ');
	try {
		// const { text } = req.body;
		// console.log('text', req.body);
		const placesURL = process.env.GOOGLE_PLACE_BASE_URL;
		const apiKey = process.env.GOOGLE_MAPS_API_KEY;

		const locationRes = await axios({
			method: 'get',
			url: `${placesURL}query=${params.map((item, index) => {
				if (index !== params.length - 1 && params.length !== 1) {
					return `${item}%20`;
				} else {
					return item;
				}
			})}&type=locality&key=${apiKey}`,
			headers: {},
		}).catch((err) => {
			throw {
				message: err.message,
			};
		});
		console.log(locationRes.data.results);
		res.json({ results: locationRes.data.results });
	} catch (err) {
		console.log(err);
	}
});

module.exports = router;
