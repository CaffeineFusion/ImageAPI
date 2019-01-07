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
			.on('response', (response) => { response.pause(); resolve(response); });
	}).then((response) => { return response.pipe(file.createWriteStream({ gzip: true })); });
}

exports.upload = function (url, fileName) {
	return uploadByURL(url, storage.bucket(config.bucket_name), fileName);
};
