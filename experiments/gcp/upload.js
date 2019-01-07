'use strict';

const request = require('request');
const path = require('path');
const {Storage} = require('@google-cloud/storage');

const config = require('./../../config.json');
const storage = new Storage({
	projectId: config.project_id,
	keyFilename: './keys/cloudStorage.json'
});

// Returns a Promise object which resolves to a stream.
function uploadByURL(url, bucket, fileName) {
	let file = bucket.file(fileName);
	return new Promise((resolve, reject) => {
		request(url)
			.on('response', (response) => { response.pause(); resolve(response); })
			.on('error', (reject));
		//.on('finish', ());
	}).then((response) => { return response.pipe(file.createWriteStream({ gzip: true })); }) // TODO: Restructure.
		.catch((error) => { return { error }; }); // TODO: Add more detailed error handling. - statusCode etc.
}
// TODO: file.createResumableUpload

exports.upload = function (url) {
	return uploadByURL(url, storage.bucket(config.bucket_name), path.basename(url));
};
