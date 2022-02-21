const express = require('express');
const { upload } = require('../utilities/imageUpload');
const router = express.Router();
const { uploadToS3 } = require('../middleware/upload');

router.post('/upload', async (req, res) => {
	try {
		const image = await uploadToS3(req, res).catch((err) => {
			throw {
				message: err.message,
			};
		});

		// const imageRes = await uploadImage(req.body.file);
		// console.log('req.file', req.imageURL);
		res.status(200).json(image);
		// .json(imageRes);
	} catch (err) {
		console.log(err);
		res.status(500).json(err.message);
	}
});

module.exports = router;
