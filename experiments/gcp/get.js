'use strict';

const {Storage} = require('@google-cloud/storage');

const config = require('./../../config.json');
const storage = new Storage({
	projectId: config.project_id,
	keyFilename: './keys/cloudStorage.json'
});


/**
 * Returns a Signed URL to access the uploaded file
 * TODO: set expiry date to match the bucket's expiry rules for files
 */
function getURL(fileName, bucket) {
	let file = bucket.file(fileName);
	return new Promise((resolve, reject) => {
		file.getSignedUrl({action:'read', expires:'01-01-2020'}, function(err, url) {
			if (err) reject(err);
			else resolve(url);
		});
	});
}

exports.get = function (fileName) {
	return getURL(fileName, storage.bucket(config.bucket_name));
};
