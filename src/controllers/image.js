const express = require('express');
const { upload } = require('../utilities/imageUpload');
const router = express.Router();

router.post('/upload', upload.any(), async (req, res) => {
	try {
		console.log('req.file', req.file);
		console.log('req.files', req.files);
		console.log('upload route success!');
		// const imageRes = await uploadImage(req.body.file);
		// console.log('req.file', req.imageURL);
		res.status(200);
		// .json(imageRes);
	} catch (err) {
		console.log(err);
	}
});

module.exports = router;
