'use strict';

const {Storage} = require('@google-cloud/storage');

const config = require('./../../config.json');
const storage = new Storage({
	projectId: config.project_id,
	keyFilename: './keys/cloudStorage.json'
});

/**
 * downloadID
 * @param  {string} 		fileName
 * @param  {Storage.bucket} bucket
 * @return {Promise}         			Promise that resolves to the download stream.
 */
function downloadByID(fileName, bucket) {
	let file = bucket.file(fileName);
	return new Promise((resolve, reject) => {
		file.createReadStream()
			.on('response', (response) => { response.pause(); resolve(response); })
			.on('error', (reject));
		//    .pipe(); // localCache
	})
		.catch((error) => { return { error }; }); // TODO: Add more detailed error handling. - statusCode etc.
}

exports.download = function (id) {
	return downloadByID(id, storage.bucket(config.bucket_name));
};
