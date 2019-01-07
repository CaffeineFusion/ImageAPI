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
		//.on('finish', ());
	}).then((response) => { return response.pipe(file.createWriteStream({ gzip: true })); }) // TODO: Restructure.
		.catch((error) => { return { error }; }); // TODO: Add more detailed error handling. - statusCode etc.
}
// TODO: file.createResumableUpload

exports.upload = function (url, fileName) {
	return uploadByURL(url, storage.bucket(config.bucket_name), fileName);
};

function downloadByID(fileName, bucket) {
	let file = bucket.file(fileName);
	return new Promise((resolve, reject) => {
		file.createReadStream()
			.on('response', (response) => { response.pause(); resolve(response); })
			.on('error', (reject))
			.pipe(); // localCache
	})
		.catch((error) => { return { error }; }); // TODO: Add more detailed error handling. - statusCode etc.
}

exports.download = function (id) {
	return downloadByID(id, storage.bucket(config.bucket_name));
};


/**
 * Returns a Signed URL to access the uploaded file
 * TODO: set expiry date to match the bucket's expiry rules for files
 */
function getURL(fileName, bucket) {
	let file = bucket.file(fileName);
	file.getSignedUrl({action:'read', expires:'01-01-2020'}, function(err, url) {
		if (err) {
			console.error(err);
			return;
		}
		return url;
	});
}



exports.get = function (fileName) {
	return getURL(fileName, storage.bucket(config.bucket_name));
};
