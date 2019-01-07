'use strict';

const request = require('request');

const config = require('./../../config.json');

const {Storage} = require('@google-cloud/storage');
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
	}).then((response) => { return response.pipe(file.createWriteStream({ gzip: true })); })
		.catch((error) => { return { error }; }); // TODO: Add more detailed error handling. - statusCode etc.
}

exports.upload = function (url, fileName) {
	return uploadByURL(url, storage.bucket(config.bucket_name), fileName);
};
