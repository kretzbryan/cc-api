// const multiparty = require('multiparty');
// const { uploadFile } = require('../utilities/imageUpload');
// // import { fileTypeFromBuffer } from 'file-type/core';
// const detect = require('detect-file-type');

const aws = require('aws-sdk');
const express = require('express');
const multer = require('multer');
const multerS3 = require('multer-s3');
const { v4 } = require('uuid');

// const app = express();

const { AWS_SECRET_ACCESS_KEY, AWS_ACCESS_KEY_ID, AWS_BUCKET_NAME } =
	process.env;

aws.Credentials(AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY);

aws.config.update({
	region: 'us-west-1',
});
const s3 = new aws.S3();

const upload = multer({
	storage: multerS3({
		s3: s3,
		bucket: AWS_BUCKET_NAME,
		metadata: function (req, file, cb) {
			cb(null, { fieldName: file.fieldname });
		},
		key: function (req, file, cb) {
			cb(null, req.uniqueId);
		},
	}),
});

const singleFileUpload = upload.single('image');

exports.uploadToS3 = (req, res) => {
	req.uniqueId = v4();
	const downloadURL = `https://s3-${'us-west-1'}.amazonaws.com/${AWS_BUCKET_NAME}/${
		req.uniqueId
	}`;
	return new Promise((resolve, reject) => {
		return singleFileUpload(req, res, (err) => {
			if (err) return reject(err);
			return resolve(downloadURL);
		});
	});
};

// const fileType = (buffer) => {
// 	return detect.fromBuffer(buffer, function (err, result) {
// 		if (err) {
// 			return console.log(err);
// 		}

// 		console.log(result); // { ext: 'jpg', mime: 'image/jpeg' }
// 	});
// };
// exports.upload = function (request, response, next) {
// 	try {
// 		console.log('one');
// 		const form = new multiparty.Form({
// 			encoding: 'utf8',
// 			maxFields: 10,
// 			maxFieldsSize: '10gb',
// 			maxFilesSize: '10gb',
// 		});
// 		console.log('two');
// 		let directory = request.params.path;
// 		console.log('three', directory);
// 		let isProperDirName = /^[a-z0-9]+$/i.test(directory);
// 		let { _id } = request.user;
// 		console.log('user_id', _id);
// 		console.log('four', isProperDirName);
// 		if (isProperDirName) {
// 			form.on('files', async function (name, file) {
// 				console.log('file', file);
// 				try {
// 					console.log('five');
// 					const path = file.path;
// 					const buffer = fs.readFileSync(path);
// 					const type = fileTypeFromBuffer(buffer);
// 					const timestamp = Date.now().toString();
// 					const fileName = `${timestamp}`;
// 					const data = await uploadFile(
// 						buffer,
// 						fileName,
// 						type,
// 						directory,
// 						user_id
// 					);
// 					console.log('six', data);
// 					console.log('ten');
// 					response.imageURL = data;
// 					response.json({
// 						success: true,
// 						message: data,
// 					});
// 				} catch (error) {
// 					console.log('err', error);
// 					throw error;
// 				}
// 			});
// 			// Parts are emitted when parsing the form
// 			form.on('part', function (part) {
// 				// You *must* act on the part by reading it
// 				// NOTE: if you want to ignore it, just call "part.resume()"
// 				console.log('part', part);
// 				if (!part.filename) {
// 					// filename is not defined when this is a field and not a file
// 					console.log('got field named ' + part.name);
// 					// ignore field's content
// 					part.resume();
// 				}
// 				if (part.filename) {
// 					// filename is defined when this is a file
// 					count++;
// 					console.log('got file named ' + part.name);
// 					// ignore file's content here
// 					part.resume();
// 				}
// 				part.on('error', function (err) {
// 					// decide what to do
// 				});
// 			});
// 			// Close emitted after form parsed
// 			form.on('close', function () {
// 				console.log('Closing request!');
// 			});
// 			form.on('error', function (err) {
// 				console.log('Error parsing form: ' + err.stack);
// 			});
// 			form.parse(request, async (error, fields, files) => {
// 				Object.keys(fields).forEach(function (name) {
// 					console.log('got field named ' + name);
// 				});
// 				Object.keys(files).forEach(function (name) {
// 					console.log('got file named ' + name);
// 				});
// 				console.log('Upload completed!');
// 				if (error) throw error;
// 			});
// 		} else {
// 			console.log('seven');
// 			response.json({
// 				success: false,
// 				message: 'Provided path is not in the appropriate string format',
// 			});
// 		}
// 	} catch (error) {
// 		console.log('eight');
// 		response.json({
// 			success: false,
// 			error: error.message,
// 		});
// 	}
// };
