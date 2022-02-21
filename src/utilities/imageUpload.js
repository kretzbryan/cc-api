const multer = require('multer'); // multer will be used to handle the form data.
const Aws = require('aws-sdk'); // aws-sdk library will used to upload image to s3 bucket.
const fs = require('fs');
// creating the storage variable to upload the file and providing the destination folder,
// if nothing is provided in the callback it will get uploaded in main directory

const storage = multer.memoryStorage({
	destination: function (req, file, cb) {
		console.log('file in multer', file);
		cb(null, '../uploads/');
	},
});

// below variable is define to check the type of file which is uploaded

const filefilter = (req, file, cb) => {
	console.log('file in filter', file);
	if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/jpg') {
		cb(null, true);
	} else {
		cb(null, false);
	}
};

// defining the upload variable for the configuration of photo being uploaded
exports.upload = multer({ storage: storage, fileFilter: filefilter });

// Now creating the S3 instance which will be used in uploading photo to s3 bucket.
const s3 = new Aws.S3({
	accessKeyId: process.env.AWS_ACCESS_KEY_ID, // accessKeyId that is stored in .env file
	secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY, // secretAccessKey is also store in .env file
});

exports.uploadImage = async function (buffer, name, type, directory) {
	try {
		const params = {
			Bucket: process.env.AWS_BUCKET_NAME, // bucket that we made earlier
			ACL: 'public-read',
			Body: buffer,
			Bucket: config.env.S3_BUCKET,
			ContentType: type.mime,
			Key: `${directory}/${name}.${type.ext}`, // Necessary to define the image content-type to view the photo in the browser with the link
		};

		return s3.upload(params).promise();
	} catch (err) {
		console.log(err.message);
	}
};
