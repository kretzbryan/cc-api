const express = require('express');
const { upload, uploadImage } = require('../utilities/imageUpload');
const router = express.Router();

router.post('/upload', upload.single('imageFile'), async (req, res) => {
	try {
		console.log('upload route success!');
		// const imageRes = await uploadImage(req.body.file);
		console.log('req.file', req.file);
		res.status(200);
		// .json(imageRes);
	} catch (err) {
		console.log(err);
	}
});

module.exports = router;
