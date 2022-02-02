const multer = require('multer'); // multer will be used to handle the form data.
const Aws = require('aws-sdk'); // aws-sdk library will used to upload image to s3 bucket.

// creating the storage variable to upload the file and providing the destination folder,
// if nothing is provided in the callback it will get uploaded in main directory

const storage = multer.memoryStorage({
	destination: function (req, file, cb) {
		console.log('file', file);
		cb(null, '../uploads/');
	},
});

// below variable is define to check the type of file which is uploaded

const filefilter = (req, file, cb) => {
	console.log('file', file);
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
	secretAccessKey: process.env.AWS_ACCESS_KEY_SECRET, // secretAccessKey is also store in .env file
});

exports.uploadImage = async function (file) {
	try {
		const params = {
			Bucket: process.env.AWS_BUCKET_NAME, // bucket that we made earlier
			Key: file.originalname, // Name of the image
			Body: file.buffer, // Body which will contain the image in buffer format
			ACL: 'public-read-write', // defining the permissions to get the public link
			ContentType: 'image/jpeg', // Necessary to define the image content-type to view the photo in the browser with the link
		};

		return s3.upload(params, (error, data) => {
			if (error) {
				throw {
					message: error.message,
				}; // if we get any error while uploading error message will be returned.
			}

			// If not then below code will be executed

			return data; // this will give the information about the object in which photo is stored
		});
	} catch (err) {
		console.log(err.message);
	}
};
