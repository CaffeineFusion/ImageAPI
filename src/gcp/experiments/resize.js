'use strict';

const {Storage} = require('@google-cloud/storage');
import * as sharp from 'sharp';

import * as download from './download.js';
const get = './get.js';
const config = require('./../../config.json');
const storage = new Storage({
	projectId: config.project_id,
	keyFilename: './keys/cloudStorage.json'
});

//TODO: Update download/get/upload files to include both named and default exports.

let resizeToStream = exports.resizeToStream = function (id, bucket, size) {
	let transform = sharp().resize(size.width, size.height);

	return download.downloadByID(id, bucket)
		.then((stream) => { stream.pipe(transform); stream.pause(); return stream; });
};

let resizeInPlace = exports.resizeInPlace = function (id, bucket, size) {
	let fileName = `resize@${size.width}x${size.height}_${fileName}`;
	let file = bucket.file(fileName);

	return resizeToStream(id, bucket, size)
		.then((stream) => { return stream.pipe(file.createWriteStream({ gzip: true })); })
		.then(() => { get.getURL(fileName, bucket); })
		.catch((error) => { return { error }; }); // TODO: Add more detailed error handling. - statusCode etc
};

// TODO: Refactor away from Firebase syntax to raw Storage listener
// https://angularfirebase.com/lessons/image-thumbnail-resizer-cloud-function/
exports resizeCRON = functions.storage
	.object()


export default function (req, res) {
	// TODO: pre-string parsing / error validation and checking.
	let width = parseInt(req.query.width);
	let height = parseInt(req.query.height);
	let id = req.params.imageID;
	//const format = req.query.format;

	return resizeToStream(id, {width, height})
		.then((stream) => {
			//res.type('');	//TODO
			return stream.pipe(res);
		});
	//return uploadByURL(url, storage.bucket(config.bucket_name), path.basename(url));
}
